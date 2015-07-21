module Jsonifiers
	module Annotation
		class AnnotationParamsParser

			attr_accessor :annotationsDeleted, :annotationsNew

			def initialize(annotationParams)
				@videoClipMap = DataImporters::VideoClipMap.new

				# format of what js gives
				# {
				# 		{ deleted_polys: {annotationId: poly, } },
				# 		{ new_polys: {annotationId: poly, } }
				# }
				# where each poly has:
				# 			{ video_id:, chia_version_id:, frame_number:, detectable_id:,
				# 		     x0:, y0:, x1:, y1:, x2:, y2:, x3:, y3:
				# 			}

				@annotationsDeleted = []
				@annotationsNew = []

				if annotationParams != nil
					if annotationParams['deleted_polys'] != nil
						annotationParams['deleted_polys'].each do |aId, a|
							@annotationsDeleted << formatAnnotation(a)
						end
					end
					if annotationParams['new_polys'] != nil
						annotationParams['new_polys'].each do |aId, a|
							@annotationsNew << formatAnnotation(a)
						end
					end
				end
			end

			def formatAnnotation(a)
				# Note: this is tied to schema in Annotation class
				annotation = {
					vi: a['video_id'].to_i,
					cl: @videoClipMap.getClipId(a['video_id'].to_i, a['video_fn'].to_i),
					ci: a['chia_version_id'].to_i,

					fn: a['video_fn'].to_i,
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
				return annotation
			end

		end
	end
end