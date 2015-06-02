module Jsonifiers
	module Localization
		class LocalizationParamsParser

			attr_accessor :chiaVersionId, :videoId, :frameNumber, :zdistThresh

			def initialize(localizationParams)
				# expect: integer
				@chiaVersionId = localizationParams['chia_version_id'].to_i if localizationParams['chia_version_id']
				# expect: integer
				@videoId = localizationParams['video_id'].to_i if localizationParams['video_id']
				# expect: integer
				@frameNumber = localizationParams['video_fn'].to_i if localizationParams['video_fn']
				# expect: float
				@zdistThresh = localizationParams['zdist_thresh'].to_i if localizationParams['zdist_thresh']
			end

		end
	end
end