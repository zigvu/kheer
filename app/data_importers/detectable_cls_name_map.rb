module DataImporters
	class DetectableClsNameMap

		def initialize(chiaVersionId)
			pluckedIds = ::Detectable.joins(:chia_version_detectables)
				.where(chia_version_detectables: {chia_version_id: chiaVersionId}).pluck(:name, :id)

			@clsNameToDetectableMap = Hash[pluckedIds.map{|k| [k[0].to_s, k[1]]}]
			@detectableToClsNameMap = Hash[pluckedIds.map{|k| [k[1], k[0].to_s]}]
		end

		def getDetectableId(clsName)
			return @clsNameToDetectableMap[clsName]
		end

		def getClsName(detectableId)
			return @detectableToClsNameMap[detectableId]
		end

	end
end
