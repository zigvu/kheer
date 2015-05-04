module Annotators
	module Queries
		class AnnotationSaver

			def initialize(parsedAnnotations)
				@annotationsDeleted = parsedAnnotations.annotationsDeleted
				@annotationsNew = parsedAnnotations.annotationsNew
			end

			def save
				totalCreated = 0
				totalDeleted = 0

				# delete annotation by setting active to false
				@annotationsDeleted.each do |annotation|
					anno = Annotation.where(annotation).first
					if anno != nil
						anno.update(active: false)
						totalDeleted += 1
					end
				end

				# create new annotation if doesn't exist
				@annotationsNew.each do |annotation|
					Annotation.create(annotation)
					totalCreated += 1
				end

				return {created: totalCreated, deleted: totalDeleted}
			end

		end
	end
end