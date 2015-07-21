module Metrics
	module Analysis
		class KheerJobSummary

			def initialize(kheerJob)
				@kheerJob = kheerJob
				@chiaVersion = @kheerJob.chia_version
				@videoId = @kheerJob.video_id

				cvs = Serializers::ChiaVersionSettingsSerializer.new(@chiaVersion)
	      @zdistThreshs = cvs.getSettingsZdistThresh
			end

			def summaryCounts
				if @kheerJob.summary_counts == nil
					sumCnt = {}
					@chiaVersion.chia_version_detectables.each do |cvd|
						det = cvd.detectable
						numAnno = Annotation.where(video_id: @videoId)
								.where(chia_version_id: @chiaVersion.id)
								.where(detectable_id: det.id).count
						numLocs = []
						@zdistThreshs.each do |zdistThresh|
							numLocs << Localization.where(video_id: @videoId)
									.where(chia_version_id: @chiaVersion.id)
									.where(detectable_id: det.id)
									.where(zdist_thresh: zdistThresh).count
						end
						sumCnt[det.id] = {
							num_anno: numAnno,
							num_locs: numLocs
						}
					end
					@kheerJob.update(summary_counts: sumCnt)
				end
				@kheerJob.summary_counts
			end

		end
	end
end