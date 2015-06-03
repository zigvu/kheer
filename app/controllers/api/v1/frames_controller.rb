module Api
	module V1
		class FramesController < ApplicationController

			before_filter :ensure_json_format

			# POST api/v1/frames/update_annotations
			def update_annotations
				annotationParams = Jsonifiers::Annotation::AnnotationParamsParser.new(params[:annotations])
				annotationSaver = Jsonifiers::Annotation::AnnotationSaver.new(annotationParams)
				saveResults = annotationSaver.save()
				render json: saveResults.to_json
			end

			# GET api/v1/frames/localization_data
			def localization_data
				localizationParams = Jsonifiers::Localization::LocalizationParamsParser.new(params[:localization])
				localizationQuery = Jsonifiers::Localization::LocalizationQuery.new(localizationParams).run()
				formatted = Jsonifiers::Localization::LocalizationFormatter.new(localizationQuery).formatted()

				render json: formatted.to_json
			end

			# GET api/v1/frames/heatmap_data
			def heatmap_data
				p = Jsonifiers::Heatmap::HeatmapParamsParser.new(params[:heatmap])
				heatmapData = Services::MessagingServices::HeatmapData.new.getData(
					p.chiaVersionId, p.videoId, p.frameNumber, p.scale, p.detectableId)
				render json: heatmapData # <- already JSON
			end
		end
	end
end
