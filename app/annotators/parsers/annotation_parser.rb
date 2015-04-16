module Annotators
	module Parsers
		class AnnotationParser

			attr_accessor :annotations

			def initialize(annotationParams)
				# format of what js gives
				# {annotation_id: 
				# 	{ detectable_id:, x0:, y0:, x1:, y1:, x2:, y2:, x3:, y3:, 
				#      video_id:, frame_number:, chia_version_id: }
				# }
				@annotations = []
				annotationParams.each do |annoId, a|
					# Note: this is tied to schema in Annotation class
					annotation = {
						vi: a['video_id'].to_i,
						ci: a['chia_version_id'].to_i,

						fn: a['frame_number'].to_i,
						#ft: a['frame_time'].to_f,
						
						di: a['detectable_id'].to_i,
						
						x0: a['x0'].to_i,
						y0: a['y0'].to_i,
						x1: a['x1'].to_i,
						y1: a['y1'].to_i,
						x2: a['x2'].to_i,
						y2: a['y2'].to_i,
						x3: a['x3'].to_i,
						y3: a['y3'].to_i
					}
					@annotations << annotation;
				end
			end

		end
	end
end