module DataImporters
	module Formatters
		class LocalizationFormatter

			def initialize(chiaVersionId)
				@detectableChiaIdMap = DataImporters::DetectableChiaIdMap.new(chiaVersionId)
			end

			def getFormatted(localization)
        # expect from python:
        # localization = {
        #   video_id:, chia_version_id:, 
        #   frame_number:, chia_class_id:, score:,
        #   zdist_thresh:, scale:, x:, y:, w:, h:
        # }

				# Note: this is tied to schema in Localization class
				localz = {
					vi: localization["video_id"].to_i,
					ci: localization["chia_version_id"].to_i,
					fn: localization["frame_number"].to_i,
					# ft: frameTime,

					di: @detectableChiaIdMap.getDetectableId(localization["chia_class_id"]),
					ps: localization["score"].to_f.round(3),
					zd: localization["zdist_thresh"].to_f,
					sl: localization["scale"].to_f,
					x: localization["x"].to_i,
					y: localization["y"].to_i,
					w: localization["w"].to_i,
					h: localization["h"].to_i
				}
				return localz
			end

		end
	end
end
