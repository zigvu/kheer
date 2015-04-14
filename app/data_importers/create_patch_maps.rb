require 'json'
require 'csv'

module DataImporters
	class CreatePatchMaps
		attr_accessor :patchMapHash

		def initialize(patchMapJSONFile)
			@patchMapHash = JSON.parse(File.read(patchMapJSONFile))
		end

		def saveToDb(chiaVersionId)
			chiaVersion = ChiaVersion.find(chiaVersionId)
			raise RuntimeError("ChiaVersion doesn't exist") if chiaVersion == nil
			PatchMap.destroy_all(chia_version_id: chiaVersionId) if chiaVersion.patch_map != nil
			patchMap = PatchMap.create(
				chia_version_id: chiaVersionId, 
				w: patchMapHash["width"].to_i, 
				h: patchMapHash["height"].to_i)
			patchMapHash["scales"].each do |patchScale|
				scale = patchScale["scale"].to_f
				patchScale["patches"].each do |patch|
					patch_id = patch["patchId"].to_i
					x = patch["bbox"]["x"].to_i
					y = patch["bbox"]["y"].to_i
					w = patch["bbox"]["w"].to_i
					h = patch["bbox"]["h"].to_i

					patchMap.patch_boxes.create(patch_id: patch_id, scale: scale, x: x, y: y, w: w, h: h)
				end
			end
			return true
		end

	end
end