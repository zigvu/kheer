module DataImporters
	class DetectableChiaIdMap

		def initialize(chiaVersionId)
			pluckedIds = ::ChiaVersionDetectable.where(chia_version_id: 1)
					.pluck(:chia_detectable_id, :detectable_id)
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
