module Jsonifiers
	module Heatmap
		class CellmapCreator

			def initialize(chiaVersion, patchIdxScores, scale)
				@chiaVersion = chiaVersion
				@patchIdxScores = patchIdxScores
				@scale = scale

				@patchMap = @chiaVersion.patch_map
				@cellMap = @chiaVersion.cell_map
			end

			def create
				# zero fill cell values
				@scaleCellValues = []
				@cellMap.cell_boxes.each do |cb|
					@scaleCellValues << -1
				end

				@patchMap.patch_boxes.where(scale: @scale).each do |patchBox|
					patchScore = @patchIdxScores[patchBox.patch_idx]
					addScore_max(patchBox, patchScore)
				end

				@scaleCellValues.each_with_index do |sv, idx|
					raise RuntimeError("Some cell values not populated") if sv < 0

					# round to integer between [0, 100]
					@scaleCellValues[idx] = (sv * 100).round
				end

				return @scaleCellValues
			end

			def addScore_max(patchBox, patchScore)
				patchBox.cell_idxs.each do |cellIdx|
					# same as intensity calculations in khajuri
					# puts "#{patchBox.scale} - #{cellIdx}"
					if @scaleCellValues[cellIdx] < patchScore
						@scaleCellValues[cellIdx] = patchScore
					end
				end
			end

		end
	end
end