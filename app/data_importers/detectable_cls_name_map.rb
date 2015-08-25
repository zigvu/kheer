module DataImporters
	class DetectableClsNameMap

		def initialize(chiaVersionId)
			@chiaVersionId = chiaVersionId
			
			pluckedIds = ::Detectable.joins(:chia_version_detectables)
				.where(chia_version_detectables: {chia_version_id: chiaVersionId}).pluck(:name, :id)

			@clsNameToDetectableIdMap = Hash[pluckedIds.map{|k| [k[0].to_s, k[1]]}]
			@detectableIdToClsNameMap = Hash[pluckedIds.map{|k| [k[1], k[0].to_s]}]

			@chiaDetIdMap = createChiaDetIdMap()
		end

		def getDetectableId(clsName)
			return @clsNameToDetectableIdMap[clsName]
		end

		def getClsName(detectableId)
			return @detectableIdToClsNameMap[detectableId]
		end

		def getChaiDetIds(detectableId)
			return @chiaDetIdMap[detectableId]
		end

		def createChiaDetIdMap
			pluckedIdHash = Hash[ChiaVersionDetectable.where(chia_version_id: @chiaVersionId)
				.pluck(:detectable_id, :chia_detectable_id)
			]
			negativeDetIds = []
			pluckedIdHash.keys.each do |detId|
				det = ::Detectable.find(detId)
				negativeDetIds << detId if States::DetectableType.new(det).isNegative?
			end
			chiaDetIdMap = {}
			pluckedIdHash.each do |detId, chiaDetId|
				if negativeDetIds.include?(detId)
					chiaDetIdMap[detId] = negativeDetIds
				else
					chiaDetIdMap[detId] = [chiaDetId]
				end
			end
			chiaDetIdMap
		end

	end
end
