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
				applyLocalizationScales()
				return @query
			end

			def applyChiaVersionId()
				chiaVersionId = @parsedFilter.chiaVersionId
				if chiaVersionId != nil
					@query = @query.where(chia_version_id: chiaVersionId)
				end
			end

			def applyDetectableIds()
				detectableIds = @parsedFilter.detectableIds
				if detectableIds != nil and detectableIds.count > 0
					@query = @query.in(detectable_id: detectableIds)
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
				if zdistThresh != nil
					@query = @query.where(zdist_thresh: zdistThresh)
				end
			end

			def applyLocalizationScales()
				scales = @parsedFilter.localizationScales
				if scales != nil and scales.count > 0
					@query = @query.in(scale: scales)
				end
			end

		end
	end
end