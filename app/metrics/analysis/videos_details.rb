module Metrics
	module Analysis
		class VideosDetails

			attr_accessor :zdistThreshs

			def initialize(chiaVersionId, videoIds)
				@chiaVersion = ::ChiaVersion.find(chiaVersionId)
				
				@kheerJobs = []
				videoIds.each do |vId|
					@kheerJobs << ::KheerJob.where(video_id: vId).where(chia_version_id: chiaVersionId).first
				end

				cvs = Serializers::ChiaVersionSettingsSerializer.new(@chiaVersion)
	      @zdistThreshs = cvs.getSettingsZdistThresh
			end

			def getDetails
				summaryCount = {}
				@kheerJobs.each do |kheerJob|
					sc = Metrics::Analysis::KheerJobSummary.new(kheerJob).summaryCounts
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