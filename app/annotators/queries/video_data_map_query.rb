module Annotators
	module Queries
		class VideoDataMapQuery

			def initialize(parsedVDM)
				@parsedVDM = parsedVDM
			end

			def run
				@query = Video
				applyVideoIds()
				return @query
			end

			def applyVideoIds()
				if @parsedVDM.videoIds.length > 0
					@query = @query.where(id: @parsedVDM.videoIds)
				end
			end

		end
	end
end