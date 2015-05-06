module DataImporters
	module Formatters
		class LocalizationFormatter

			def initialize(detectableChiaIdMap, videoId, chiaVersionId)
				@detectableChiaIdMap = detectableChiaIdMap
				@videoId = videoId
				@chiaVersionId = chiaVersionId
			end

			def getFormatted(frameNumber, frameTime, chiaClsId, localization)
				# Note: this is tied to schema in Localization class
				localz = {
					vi: @videoId,
					ci: @chiaVersionId,
					fn: frameNumber,
					ft: frameTime,

					di: @detectableChiaIdMap.getDetectableId(chiaClsId),
					ps: localization["score"].to_f.round(2),
					zd: localization["zdist_thresh"].to_f,
					sl: localization["scale"].to_f,
					x: localization["bbox"]["x"].to_i,
					y: localization["bbox"]["y"].to_i,
					w: localization["bbox"]["width"].to_i,
					h: localization["bbox"]["height"].to_i
				}
				return localz
			end

		end
	end
end
