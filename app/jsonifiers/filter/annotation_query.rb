module Jsonifiers
	module Filter
		class AnnotationQuery

			def initialize(parsedFilter)
				@parsedFilter = parsedFilter
			end

			def run
				@query = ::Annotation.where(active: true)
				# applyChiaVersionId()
				return @query
			end

			def applyChiaVersionId()
				if @parsedFilter.chiaVersionId != nil
					@query = @query.where(chia_version_id: @parsedFilter.chiaVersionId)
				end
			end

		end
	end
end