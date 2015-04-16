module Annotators
	module Queries
		class FilterQueryLocalization

			def initialize(parsedFilter)
				@parsedFilter = parsedFilter
			end

			def run
				@query = Localization
				applyChiaVersionId()
				applyDetectableIds()
				applyLocalizationProbScores()
				applyLocalizationZdistThresh()
				return @query
			end

			def applyChiaVersionId()
				if @parsedFilter.chiaVersionId != nil
					@query = @query.where(chia_version_id: @parsedFilter.chiaVersionId)
				end
			end

			def applyDetectableIds()
				if @parsedFilter.detectableIds != nil and @parsedFilter.detectableIds.count > 0
					@query = @query.in(detectable_id: @parsedFilter.detectableIds)
				end
			end

			def applyLocalizationProbScores()
				probScores = @parsedFilter.localizationProbScores
				if probScores != nil and probScores.count == 2
					@query = @query.gte(prob_score: probScores[0]).lte(prob_score: probScores[1])
				end
			end

			def applyLocalizationZdistThresh()
				zdistThresh = @parsedFilter.localizationZdistThresh
				if zdistThresh != nil and zdistThresh.count > 0
					@query = @query.in(zdist_thresh: zdistThresh)
				end
			end

		end
	end
end