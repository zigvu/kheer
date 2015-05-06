module Jsonifiers
	module Localization
		class LocalizationQuery

			def initialize(parsedFilter)
				@parsedFilter = parsedFilter
			end

			def run
				@query = ::Localization
				applyChiaVersionId()
				applyVideoId()
				applyFrameNumber()
				applyZdistThresh()
				return @query
			end

			def applyChiaVersionId()
				chiaVersionId = @parsedFilter.chiaVersionId
				if chiaVersionId != nil
					@query = @query.where(chia_version_id: chiaVersionId)
				end
			end

			def applyVideoId()
				videoId = @parsedFilter.videoId
				if videoId != nil
					@query = @query.where(video_id: videoId)
				end
			end

			def applyFrameNumber()
				frameNumber = @parsedFilter.frameNumber
				if frameNumber != nil
					@query = @query.where(frame_number: frameNumber)
				end
			end

			def applyZdistThresh()
				zdistThresh = @parsedFilter.zdistThresh
				if zdistThresh != nil
					@query = @query.where(zdist_thresh: zdistThresh)
				end
			end

		end
	end
end