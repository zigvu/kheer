require 'json'

module DataImporters
	class CreateMaps
		attr_accessor :patchMapHash, :cellMapHash, :colorMapHash

		def initialize(patchMapJSONFile, cellMapJSONFile, colorMapJSONFile)
			@patchMapHash = JSON.parse(File.read(patchMapJSONFile))
			@cellMapHash = JSON.parse(File.read(cellMapJSONFile))
			@colorMapHash = JSON.parse(File.read(colorMapJSONFile))
		end

		def saveToDb(chiaVersionId)
			chiaVersion = ChiaVersion.find(chiaVersionId)
			raise RuntimeError("ChiaVersion doesn't exist") if chiaVersion == nil
			savePatchMap(chiaVersion)
			saveCellMap(chiaVersion)
		end

		def savePatchMap(chiaVersion)
			PatchMap.destroy_all(chia_version_id: chiaVersion.id) if chiaVersion.patch_map != nil
			patchMap = PatchMap.create(
				chia_version_id: chiaVersion.id, 
				w: @patchMapHash["width"].to_i, 
				h: @patchMapHash["height"].to_i,
				color_map: @colorMapHash
			)
			scales = []
			@patchMapHash["scales"].each do |patchScale|
				scale = patchScale["scale"].to_f
				scales << scale

				patchScale["patches"].each do |patch|
					patch_idx = patch["patchId"].to_i
					x = patch["bbox"]["x"].to_i
					y = patch["bbox"]["y"].to_i
					w = patch["bbox"]["w"].to_i
					h = patch["bbox"]["h"].to_i

					cellIdxs = getCellIdxs(scale, x, y, w, h)
					raise RuntimeError("Cellmap missing: #{scale}: #{x}, #{y}") if cellIdxs == nil

					patchMap.patch_boxes.create(
						patch_idx: patch_idx, scale: scale, x: x, y: y, w: w, h: h, cell_idxs: cellIdxs
					)
				end
			end
			patchMap.update(scales: scales.uniq)
			return true
		end

		def saveCellMap(chiaVersion)
			CellMap.destroy_all(chia_version_id: chiaVersion.id) if chiaVersion.cell_map != nil
			cellMap = CellMap.create(
				chia_version_id: chiaVersion.id, 
				w: @cellMapHash['frameDim']["width"].to_i, 
				h: @cellMapHash['frameDim']["height"].to_i
			)
			# since we only draw heatmap in scale 1, we use that for cell boundaries
			@cellMapHash['scales']['1.0']['cell_boundaries'].each do |cbIdx, cb|
				cell_idx = cbIdx.to_i
				x = cb["x0"].to_i
				y = cb["y0"].to_i
				w = cb["x3"].to_i - cb["x0"].to_i
				h = cb["y3"].to_i - cb["y0"].to_i

				cellMap.cell_boxes.create(cell_idx: cell_idx, x: x, y: y, w: w, h: h)
			end
			return true
		end

		def getCellIdxs(scale, x, y, w, h)
			cellIdxs = nil
			@cellMapHash['scales'][scale.to_s]['sw_mapping'].each do |sw|
				if ((sw['x'].to_i == x) and 
					(sw['y'].to_i == y) and 
					(sw['w'].to_i == w) and 
					(sw['h'].to_i == h))
						cellIdxs = sw['map']
						break
				end
			end
			return cellIdxs
		end

	end
end