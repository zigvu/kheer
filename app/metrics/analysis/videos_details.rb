module Metrics
	module Analysis
		class VideosDetails

			attr_accessor :zdistThreshs

			def initialize(chiaVersionId, videoIds)
				@chiaVersion = ::ChiaVersion.find(chiaVersionId)
				@videoIds = videoIds

				cvs = Serializers::ChiaVersionSettingsSerializer.new(@chiaVersion)
	      @zdistThreshs = cvs.getSettingsZdistThresh
			end

			def getDetails
				retArr = []
				# structure:
				# [{det_id:, det_name:, num_anno:, num_locs: [count_zdist_thresh, ]}, ]
				@chiaVersion.chia_version_detectables.each do |cvd|
					det = cvd.detectable
					numAnno = Annotation.in(video_id: @videoIds)
							.where(chia_version_id: @chiaVersion.id)
							.where(detectable_id: det.id).count
					numLocs = []
					@zdistThreshs.each do |zdistThresh|
						numLocs << Localization.in(video_id: @videoIds)
								.where(chia_version_id: @chiaVersion.id)
								.where(detectable_id: det.id)
								.where(zdist_thresh: zdistThresh).count
					end
					retArr << {
						det_id: det.id,
						det_name: det.pretty_name,
						num_anno: numAnno,
						num_locs: numLocs
					}
					#break
				end
				retArr
			end

		end
	end
end