module DataImporters
	module Formatters
		class AnnotationFormatter

			def initialize(detectableClsNameMap, chiaVersionId)
				@detectableClsNameMap = detectableClsNameMap
				@chiaVersionId = chiaVersionId
			end

			def getFormatted(videoId, frameNumber, frameTime, clsName, annotation)
				# Note: this is tied to schema in Annotation class
				anno = {
					vi: videoId,
					ci: @chiaVersionId,
					fn: frameNumber,
					ft: frameTime,
					at: true,

					di: @detectableClsNameMap.getDetectableId(clsName),
					x0: annotation['x0'].to_i,
					y0: annotation['y0'].to_i,
					x1: annotation['x1'].to_i,
					y1: annotation['y1'].to_i,
					x2: annotation['x2'].to_i,
					y2: annotation['y2'].to_i,
					x3: annotation['x3'].to_i,
					y3: annotation['y3'].to_i
				}
				return anno
			end

		end
	end
end
