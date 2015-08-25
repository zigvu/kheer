module DataExporters
	module Formatters
		class AnnotationFormatter

			attr_accessor :annoFilename

			def initialize(chiaVersionId, videoId, frameNumber, width, height)
				@chiaVersionId = chiaVersionId
				@videoId = videoId
				@frameNumber = frameNumber
				@width = width
				@height = height

				@annotations = {}
				@frameFilename = "#{@videoId}_#{@frameNumber}.png"
				@annoFilename = "#{@videoId}_#{@frameNumber}.json"				
			end

			def getFormatted
				# Note: this is tied to JSON expectation of Chia python scripts
				return {
					chia_version_id: @chiaVersionId,
					video_id: @videoId,
					frame_number: @frameNumber,

					width: @width,
					height: @height,
					frame_filename: @frameFilename,
					annotation_filename: @annoFilename,
					annotations: @annotations
				}
			end

			def addAnnotation(cls, anno)
				if @annotations[cls] == nil
					@annotations[cls] = []
				end

				@annotations[cls] += [getFormattedAnno(anno)]
			end

			def getFormattedAnno(anno)
				return {
					annotation_id: anno.id.to_s,

					x0: anno.x0,
					y0: anno.y0,
					
					x1: anno.x1,
					y1: anno.y1,
					
					x2: anno.x2,
					y2: anno.y2,
					
					x3: anno.x3,
					y3: anno.y3
				}
			end

		end
	end
end
