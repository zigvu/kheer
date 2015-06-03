require 'json'

module DataImporters
	class CreateMaps
		attr_accessor :cellMapHash, :colorMapHash

		def initialize(cellMapFile, colorMapFile)
			@cellMapHash = JSON.parse(File.read(cellMapFile))
			@colorMapHash = JSON.parse(File.read(colorMapFile))
		end

		def saveToDb(chiaVersion)
			saveCellMap(chiaVersion)
			saveColorMap(chiaVersion)
		end

		def saveCellMap(chiaVersion)
			CellMap.destroy_all(chia_version_id: chiaVersion.id) if chiaVersion.cell_map != nil
			CellMap.create(
				chia_version_id: chiaVersion.id, 
				width: @cellMapHash['frameDim']['width'].to_i, 
				height: @cellMapHash['frameDim']['height'].to_i, 
				cell_map: @cellMapHash['cell_boundaries']
			)
		end

		def saveColorMap(chiaVersion)
			ColorMap.destroy_all(chia_version_id: chiaVersion.id) if chiaVersion.color_map != nil
			ColorMap.create(chia_version_id: chiaVersion.id, color_map: @colorMapHash)
		end

	end
end