module Api
	module V1
		class FramesController < ApplicationController

			before_filter :ensure_json_format

			# POST api/v1/frames/update_annotations
			def update_annotations
				annotations = Annotators::Parsers::AnnotationParser.new(params[:annotations])
				annotationSaver = Annotators::Queries::AnnotationSaver.new(annotations)
				saveResults = annotationSaver.save()
				render json: saveResults.to_json
			end

			private

				# Only allow a trusted parameter "white list" through.
				def frames_params
					params.permit(:annotations)
				end

		end
	end
end
