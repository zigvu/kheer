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

			# GET api/v1/frames/heatmap_data
			def heatmap_data
				p = Jsonifiers::Heatmap::HeatmapParamsParser.new(params[:heatmap])
				hde = Jsonifiers::Heatmap::HeatmapDataExtractor.new(
					p.chiaVersionId, p.videoId, p.frameNumber, p.scale, p.detectableId)
				render json: hde.formatted().to_json
			end

			private

				# Only allow a trusted parameter "white list" through.
				def frames_params
					# TBD: Not used currently
					params.permit(:annotations, :heatmap)
				end

		end
	end
end
