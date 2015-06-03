module Jsonifiers
	module Heatmap
		class HeatmapParamsParser

			attr_accessor :chiaVersionId, :videoId, :frameNumber
			attr_accessor :scale, :detectableId

			def initialize(heatmapParams)
				# expect: integer
				@chiaVersionId = heatmapParams['chia_version_id'].to_i if heatmapParams['chia_version_id']
				# expect: integer
				@videoId = heatmapParams['video_id'].to_i if heatmapParams['video_id']
				# expect: integer
				@frameNumber = heatmapParams['video_fn'].to_i if heatmapParams['video_fn']
				# expect: float
				@scale = heatmapParams['scale'].to_f if heatmapParams['scale']
				# expect: integer
				@detectableId = heatmapParams['detectable_id'].to_i if heatmapParams['detectable_id']
			end

		end
	end
end