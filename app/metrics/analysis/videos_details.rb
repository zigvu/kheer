module Metrics
	module Analysis
		class VideosDetails

			attr_accessor :zdistThreshs

			def initialize(chiaVersionId, videoIds)
				@chiaVersion = ::ChiaVersion.find(chiaVersionId)
				@detectables = ::Detectable.where(id: @chiaVersion.chia_version_detectables.pluck(:detectable_id))
				
				@kheerJobs = []
				videoIds.each do |vId|
					@kheerJobs << ::KheerJob.where(video_id: vId).where(chia_version_id: chiaVersionId).first
				end

				cvs = Serializers::ChiaVersionSettingsSerializer.new(@chiaVersion)
	      @zdistThreshs = cvs.getSettingsZdistThresh
			end

			def getZdistDifferencerMatrix(priZdist, priScales, secZdists, intThresh)
				@kheerJobs.each do |kheerJob|
					if kheerJob.summary_zdist_differencers.count == 0
						# compute and save summary
						Metrics::Analysis::ZdistDifferencerMatrix.new(kheerJob).computeAndSaveConfusions
					end
				end
				kheerJobIds = @kheerJobs.map{ |kj| kj.id }
				# run query across all kheer job summaries
				confMats = ::SummaryZdistDifferencer.in(kheer_job_id: kheerJobIds)
						.where(pri_zdist_thresh: priZdist)
						.in(pri_scale: priScales)
						.in(sec_zdist_thresh: secZdists)
						.where(int_thresh: intThresh)
						.pluck(:sec_zdist_thresh, :confusion_matrix)

				retArr = []
				maxConfCount = 1
				# structure:
				# [{name:, row:, col:, value: count:}, ]
				@zdistThreshs.each_with_index do |zdistRow, rowIdx|
					@detectables.each_with_index do |detCol, colIdx|

						confCount = 0
						confMats.each do |secZdist, confMat|
							next if zdistRow != secZdist
							confCount += confMat[detCol.id.to_s]
						end # confMats

						# puts "[#{detCol.id}][#{zdistRow}] : #{confCount}" if confCount > 0
						retArr << {
							name: "#{detCol.pretty_name} [#{detCol.id}] :: #{zdistRow}",
							row: rowIdx,
							col: colIdx,
							value: 0,
							count: confCount
						}
						maxConfCount = [maxConfCount, confCount].max

					end # detCol
				end # zdistRow
				retArr.each do |ra|
					ra[:value] = (1.0 * ra[:count] / maxConfCount).round(3)
				end
				retArr
			end

			def getConfusionFinderMatrix(priZdist, priScales, secZdist, secScales, intThreshs)
				@kheerJobs.each do |kheerJob|
					if kheerJob.summary_confusion_finders.count == 0
						# compute and save summary
						Metrics::Analysis::ConfusionFinderMatrix.new(kheerJob).computeAndSaveConfusions
					end
				end
				kheerJobIds = @kheerJobs.map{ |kj| kj.id }
				# run query across all kheer job summaries
				confMats = ::SummaryConfusionFinder.in(kheer_job_id: kheerJobIds)
						.where(pri_zdist_thresh: priZdist)
						.in(pri_scale: priScales)
						.where(sec_zdist_thresh: secZdist)
						.in(sec_scale: secScales)
						.in(int_thresh: intThreshs)
						.pluck(:confusion_matrix)

				retArr = []
				maxConfCount = 1
				# structure:
				# [{name:, row:, col:, value: count:}, ]
				@detectables.each_with_index do |detRow, rowIdx|
					@detectables.each_with_index do |detCol, colIdx|

						confCount = 0
						confMats.each do |confMat|
							confCount += confMat[detRow.id.to_s][detCol.id.to_s]
						end # confMats

						# puts "[#{detRow.id}][#{detCol.id}] : #{confCount}" if confCount > 0
						retArr << {
							name: "#{detRow.pretty_name} [#{detRow.id}] :: #{detCol.pretty_name} [#{detCol.id}]",
							row: rowIdx,
							col: colIdx,
							value: 0,
							count: confCount
						}
						maxConfCount = [maxConfCount, confCount].max

					end # detCol
				end # detRow
				retArr.each do |ra|
					ra[:value] = (1.0 * ra[:count] / maxConfCount).round(3)
				end
				retArr
			end

			def getSummaryCounts
				summaryCount = {}
				@kheerJobs.each do |kheerJob|
					sc = Metrics::Analysis::SummaryCounts.new(kheerJob).getSummaryCounts
					sc.each do |detId, counts|
						if summaryCount[detId] == nil
							summaryCount[detId] = counts
						else
							summaryCount[detId][:num_anno] += counts[:num_anno]
							summaryCount[detId][:num_locs].each_with_index do |l, idx|
								summaryCount[detId][:num_locs][idx] += counts[:num_locs][idx]
							end
						end
					end
				end
				retArr = []
				# structure:
				# [{det_id:, det_name:, num_anno:, num_locs: [count_zdist_thresh, ]}, ]
				summaryCount.each do |detId, counts|
					retArr << {
						det_id: detId,
						det_name: ::Detectable.find(detId).pretty_name,
						num_anno: counts[:num_anno],
						num_locs: counts[:num_locs]
					}
				end
				retArr
			end

		end
	end
end