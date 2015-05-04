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
				@frameNumber = heatmapParams['frame_number'].to_i if heatmapParams['frame_number']
				# expect: float
				@scale = heatmapParams['scale'].to_f if heatmapParams['scale']
				# expect: integer
				@detectableId = heatmapParams['detectable_id'].to_i if heatmapParams['detectable_id']
			end

		end
	end
end