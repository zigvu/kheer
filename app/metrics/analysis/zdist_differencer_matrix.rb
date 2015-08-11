module Metrics
	module Analysis
		class ZdistDifferencerMatrix

			def initialize(kheerJob)
				@kheerJob = kheerJob
				@chiaVersionId = kheerJob.chia_version_id
				@videoId = kheerJob.video_id

				chiaVersion = ::ChiaVersion.find(@chiaVersionId)
				@detIds = chiaVersion.chia_version_detectables.pluck(:detectable_id)

				cvs = Serializers::ChiaVersionSettingsSerializer.new(chiaVersion)
				@zdistThreshs = cvs.getSettingsZdistThresh.map{ |z| z.to_f }
		    @scales = cvs.getSettingsScales.map{ |s| s.to_f }

				@intersectionThreshs = ::KheerJob.intersection_threshs
				@bboxIntersector = Metrics::Analysis::BboxIntersector.new
				@summaryDumper = DataImporters::MongoCollectionDumper.new('SummaryZdistDifferencer')
			end

			def computeIntersections(localizations, intersections)
				localizations.each do |pri|
					# local storage for finding missing bboxes
					# format: {intThresh: {zdist: count}}
					missingLocs = getInitializedMissingLocs(pri.zdist_thresh)
					# format: [[secZdist, intThresh], ]
					rankingLocs = []
					localizations.each do |sec|
						# don't compare to self - this would be 100%
						next if pri.id == sec.id
						# don't compare same zdist - these are not missing
						next if pri.zdist_thresh == sec.zdist_thresh
						# fraction of secondary that falls under primary
						interArea = @bboxIntersector.intersectArea(sec, pri)
						rankingLocs << [sec.zdist_thresh, interArea]
					end # sec

					rankingLocs.group_by {|r| r[0] }.each do |secZdist, rl|
						maxInt = rl.map { |r| r[1] }.max
						@intersectionThreshs.each do |intThresh|
							missingLocs[intThresh][secZdist] = 0 if maxInt >= intThresh
						end
					end # rankingLocs

					missingLocs.each do |intThresh, ml|
						ml.each do |secZdist, cnt|
							intersections[pri.zdist_thresh][intThresh][secZdist][pri.detectable_id] += cnt
						end
					end # missingLocs

				end # pri
				intersections
			end

			def computeAndSaveConfusions
				# delete any old confusions in database
				@kheerJob.summary_zdist_differencers.destroy_all
				# loop through all detectables and scales
				@scales.each do |priScale|
					intersections = getInitializedIntersections()

					@detIds.each do |priDetId|	
						# run query
						q = ::Localization.where(video_id: @videoId)
								.where(chia_version_id: @chiaVersionId)
								.where(scale: priScale)
								.where(detectable_id: priDetId)

						q.group_by(&:frame_number).each do |fn, localizations|
							intersections = computeIntersections(localizations, intersections)
						end # q
					end # priDetId

					# save results
					dumpFormattedJobSummary(priScale, intersections)
				end # priScale
				@summaryDumper.finalize()
			end

			def dumpFormattedJobSummary(priScale, intersections)
				intersections.each do |priZdist, priZdistVal|
					priZdistVal.each do |intThresh, intThreshVal|
						intThreshVal.each do |secZdist, secZdistVal|
							# Note: this is tied to schema in SummaryZdistDifferencer class
							kjs = {
								pzt: priZdist,
								szt: secZdist,
								psl: priScale,
								inth: intThresh,
								cmat: secZdistVal,
								kheer_job_id: @kheerJob.id
							}
							@summaryDumper.add(kjs)
						end # secZdist
					end # intThresh
				end # priZdist
				true
			end

			def getInitializedIntersections
				# format:
				# intersections[:priZdist][:intThresh][:secZdist][:priDetId] = count
				intersections = {}
				@zdistThreshs.each do |priZdist|
					intersections[priZdist] = {}
					@intersectionThreshs. each do |intThresh|
						intersections[priZdist][intThresh] = {}
						@zdistThreshs.each do |secZdist|
							intersections[priZdist][intThresh][secZdist] = {}
							@detIds.each do |priDetId|
								intersections[priZdist][intThresh][secZdist][priDetId] = 0
							end # priDetId
						end # secZdist
					end # intThresh
				end # priZdist
				intersections
			end

			def getInitializedMissingLocs(zdist)
				# format: {intThresh: {zdist: count}}
				missingLocs = {}
				@intersectionThreshs.each do |intThresh|
					missingLocs[intThresh] = Hash[@zdistThreshs.map{ |z| [z, 1] }]
					missingLocs[intThresh][zdist] = 0
				end
				missingLocs
			end

		end
	end
end
