module Annotators
	module Parsers
		class FilterParser

			attr_accessor :chiaVersionId, :detectableIds
			attr_accessor :localizationProbScores, :localizationZdistThresh

			def initialize(filterParams)
				# expect: single id number
				@chiaVersionId = filterParams['chia_version_id'].to_i if filterParams['chia_version_id']
				# expect: single id number
				@detectableIds = filterParams['detectable_ids'].map{ |s| s.to_i } if filterParams['detectable_ids']
				# expect: hash of different params
				localization = filterParams['localization_scores']
				if localization != nil
					# expect: array of two numbers
					@localizationProbScores = localization['prob_scores'].map{ |s| s.to_f } if localization['prob_scores']
					# expect: array of at least one number
					@localizationZdistThresh = localization['zdist_thresh'].map{ |s| s.to_f } if localization['zdist_thresh']
				end
			end

		end
	end
end