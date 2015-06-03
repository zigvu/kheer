module Jsonifiers
	module Filter
		class AnnotationQuery

			def initialize(parsedFilter)
				@parsedFilter = parsedFilter
			end

			def run
				@query = ::Annotation.where(active: true)
				# applyChiaVersionId()
				applyVideoIds()
				return @query
			end

			def applyChiaVersionId()
				if @parsedFilter.chiaVersionId != nil
					@query = @query.where(chia_version_id: @parsedFilter.chiaVersionId)
				end
			end

			def applyVideoIds()
				videoIds = @parsedFilter.videoIds
				if videoIds != nil and videoIds.count > 0
					@query = @query.in(video_id: videoIds)
				end
			end

		end
	end
end