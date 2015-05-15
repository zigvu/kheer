module Jsonifiers
	module Filter
		class FilterParamsParser

			attr_accessor :chiaVersionId, :detectableIds
			attr_accessor :localizationProbScores, :localizationZdistThresh, :localizationScales
			attr_accessor :videoIds

			def initialize(filterParams)
				# expect: single id number
				@chiaVersionId = filterParams['chia_version_id'].to_i if filterParams['chia_version_id']
				# expect: array of id numbers
				@detectableIds = filterParams['detectable_ids'].map{ |s| s.to_i } if filterParams['detectable_ids']
				# expect: hash of different params
				localization = filterParams['localization_scores']
				if localization != nil
					# expect: array of two floats
					@localizationProbScores = localization['prob_scores'].map{ |s| s.to_f } if localization['prob_scores']
					# expect: single float value
					@localizationZdistThresh = localization['zdist_thresh'].to_f if localization['zdist_thresh']
					# expect: array of floats
					@localizationScales = localization['scales'].map{ |s| s.to_f } if localization['scales']
				end
				# expect: array of id numbers
				@videoIds = filterParams['video_ids'].map{ |s| s.to_i } if filterParams['video_ids']
			end

		end
	end
end