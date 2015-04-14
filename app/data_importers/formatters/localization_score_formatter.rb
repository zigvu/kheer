module DataImporters
	module Formatters
		class LocalizationScoreFormatter

			def initialize(detectableChiaIdMap)
				@detectableChiaIdMap = detectableChiaIdMap			
			end

			def getFormatted(chiaClsId, localization)
				# Note: this is tied to schema in LocalizationScore class
				localizationScore = {
					di: @detectableChiaIdMap.getDetectableId(chiaClsId),
					ps: localization["score"].to_f,
					zd: localization["zdist_thresh"].to_f,
					sl: localization["scale"].to_f,
					x: localization["bbox"]["x"].to_i,
					y: localization["bbox"]["y"].to_i,
					w: localization["bbox"]["width"].to_i,
					h: localization["bbox"]["height"].to_i
				}
				return localizationScore
			end

		end
	end
end
