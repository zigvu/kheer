module Jsonifiers
	module Heatmap
		class HeatmapDataExtractor

			def initialize(chiaVersionId, videoId, frameNumber, scale, detectableId)
				@chiaVersion = ::ChiaVersion.find(chiaVersionId)
				@scale = scale
				@detectableId = detectableId
				@frameScore = FrameScore
					.where(chia_version_id: chiaVersionId)
					.where(video_id: videoId)
					.where(frame_number: frameNumber).first
			end

			def formatted
				# get scores
				patchIdxScores = @frameScore.getScores()[@detectableId.to_s]['prob']
				cc = Jsonifiers::Heatmap::CellmapCreator.new(@chiaVersion, patchIdxScores, @scale)
				scaleCellValues = cc.create()

				# format into what js expects
				# NOTE: cell_values_integers are in the range of [0,100]
				# {scores: [cell_values_integers, ]}

				return {scores: scaleCellValues}
			end

		end
	end
end