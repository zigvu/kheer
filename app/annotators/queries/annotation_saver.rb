module Annotators
	module Queries
		class AnnotationSaver

			def initialize(parsedAnnotations)
				@annotations = parsedAnnotations.annotations
				@annotationIdentifier = {
					ci: @annotations[0][:ci], 
					vi: @annotations[0][:vi], 
					fn: @annotations[0][:fn]
				}
			end

			def save
				totalCreated = 0
				totalDeleted = 0
				# create new annotation if doesn't exist
				@annotations.each do |annotation|
					if Annotation.where(annotation).count == 0
						Annotation.create(annotation)
						totalCreated += 1
					end
				end
				# delete annotations not required
				Annotation.where(@annotationIdentifier).each do |annotationObj|
					deleteAnnotation = true
					@annotations.each do |annotationHash|
						if isSame?(annotationObj, annotationHash)
							deleteAnnotation = false
						end
					end
					if deleteAnnotation
						annotationObj.destroy
						totalDeleted += 1
					end
				end

				return {created: totalCreated, deleted: totalDeleted}
			end

			def isSame?(annotationObj, annotationHash)
				same = true
				annotationHash.each do |k, v|
					same = false if annotationObj[k] != v
				end
				return same
			end

		end
	end
end