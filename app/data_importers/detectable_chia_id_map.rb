module DataImporters
	class DetectableChiaIdMap

		def initialize(chiaVersionId)
			@chiaVersionId = chiaVersionId
			pluckedIds = Detectable.where(chia_version_id: chiaVersionId).pluck(:chia_detectable_id, :id)
			@chiaToDetectableMap = Hash[pluckedIds.map{|k| [k[0].to_s, k[1]]}]
			@detectableToChiaMap = Hash[pluckedIds.map{|k| [k[1], k[0].to_s]}]
		end

		def getDetectableId(chiaClsId)
			return @chiaToDetectableMap[chiaClsId]
		end

		def getChiaId(detectableId)
			return @detectableToChiaMap[detectableId]
		end

	end
end
