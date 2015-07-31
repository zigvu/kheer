module Metrics
	module Analysis
		class ConfusionMatrix

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
				@summaryDumper = DataImporters::MongoCollectionDumper.new('KheerJobSummary')
			end

			def computeIntersections(localizations, intersections, priZdist, priScale, secZdist, secScale)
				localizations.each do |pri|
					localizations.each do |sec|
						# don't compare to self - this would be 100%
						next if pri.id == sec.id
						next if not (pri.zdist_thresh == priZdist and pri.scale == priScale)
						next if not (sec.zdist_thresh == secZdist and sec.scale == secScale)

						interArea = @bboxIntersector.intersectArea(pri, sec)
						interArea = 1 if interArea > 1
						intThresh = interArea.round(1)
						intersections[intThresh][pri.detectable_id][sec.detectable_id] += 1
					end
				end
				intersections
			end

			def computeAndSaveConfusions
				# delete any old confusions in database
				@kheerJob.kheer_job_summaries.destroy_all
				# loop through all zdist and scales
				@zdistThreshs.each do |priZdist|
					@scales.each do |priScale|

						@zdistThreshs.each do |secZdist|
							@scales.each do |secScale|
								intersections = getInitializedIntersections()
								# run query
								q = ::Localization.where(video_id: @videoId, chia_version_id: @chiaVersionId)
										.or(
											::Localization.where(zdist_thresh: priZdist, scale: priScale).selector,
											::Localization.where(zdist_thresh: secZdist, scale: secScale).selector												
										)
								q.group_by(&:frame_number).each do |fn, localizations|
									intersections = computeIntersections(
										localizations, intersections, priZdist, priScale, secZdist, secScale)
								end

								# save results
								dumpFormattedJobSummary(priZdist, priScale, secZdist, secScale, intersections)

							end # secScale
						end # secZdist

					end # priScale
				end # priZdist
				@summaryDumper.finalize()
			end

			def dumpFormattedJobSummary(priZdist, priScale, secZdist, secScale, intersections)
				@intersectionThreshs. each do |intThresh|
					# Note: this is tied to schema in KheerJobSummary class
					kjs = {
						pzt: priZdist,
						szt: secZdist,
						psl: priScale,
						ssl: secScale,
						inth: intThresh,
						cmat: intersections[intThresh],
						kheer_job_id: @kheerJob.id
					}
					@summaryDumper.add(kjs)
				end
			end

			def getInitializedIntersections
				# format:
				# intersections[:priDetId][:secDetId] = count
				intersections = {}

				@intersectionThreshs. each do |intThresh|
					intersections[intThresh] = {}
					@detIds.each do |priDetId|
						intersections[intThresh][priDetId] = {}
						@detIds.each do |secDetId|
							intersections[intThresh][priDetId][secDetId] = 0
						end # secDetId
					end # priDetId
				end # intThresh
				intersections
			end

		end
	end
end