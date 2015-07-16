module Api
	module V1
		class FiltersController < ApplicationController

			before_filter :ensure_json_format

			# POST api/v1/filters/video_list
			def video_list
				filter = Jsonifiers::Filter::FilterParamsParser.new(params[:filter])
				fql = Jsonifiers::Filter::LocalizationQuery.new(filter).run()
				videoIdFrameNumberArr = fql.pluck(:video_id, :frame_number)
				formatted = Jsonifiers::Video::VideoToClipMapper.new(videoIdFrameNumberArr).formatted()

				render json: formatted.to_json
			end

			# POST api/v1/filters/filtered_summary
			def filtered_summary
				filter = Jsonifiers::Filter::FilterParamsParser.new(params[:filter])
				fql = Jsonifiers::Filter::LocalizationQuery.new(filter).run()
				fqa = Jsonifiers::Filter::AnnotationQuery.new(filter).run()

				fqlCount = fql.count
				fqaCount = fqa.count
				fqlVideoCount = fql.pluck(:video_id).uniq.count
				fqlFrameCount = fql.pluck(:frame_number).uniq.count

				render json: {
					:'Localization Count' => fqlCount,
					:'Annotation Count' => fqaCount,
					:'Video Count' => fqlVideoCount,
					:'Frame Count' => fqlFrameCount
				}.to_json
			end

			# POST api/v1/filters/filtered_data
			def filtered_data
				filter = Jsonifiers::Filter::FilterParamsParser.new(params[:filter])
				fql = Jsonifiers::Filter::LocalizationQuery.new(filter).run()
				formattedLocs = Jsonifiers::Localization::LocalizationFormatter.new(fql).formatted()

				fqa = Jsonifiers::Filter::AnnotationQuery.new(filter).run()
				formattedAnno = Jsonifiers::Annotation::AnnotationFormatter.new(fqa).formatted()

				formatted = formattedLocs.merge(formattedAnno)
				render json: formatted.to_json
			end

			# GET api/v1/filters/color_map
			def color_map
				chiaVersionId = params[:chia_version_id]
				colorMap = ::ChiaVersion.find(chiaVersionId).color_map.color_map
				render json: {color_map: colorMap}.to_json
			end

			# GET api/v1/filters/cell_map
			def cell_map
				chiaVersionId = params[:chia_version_id]
				cellMap = ::ChiaVersion.find(chiaVersionId).cell_map.cell_map
				render json: {cell_map: cellMap}.to_json
			end

			# GET api/v1/filters/detectables
			def detectables
				chiaVersionId = params[:chia_version_id].to_i

				formatted = Jsonifiers::Detectable::DetectableFormatter.new(chiaVersionId).formatted()
				render json: formatted.to_json
			end

			# GET api/v1/filters/chia_versions
			def chia_versions
				@chiaVersions = ::ChiaVersion.all
				render json: @chiaVersions.to_json(:only => [:id, :name, :description, :settings])
			end

			# GET api/v1/filters/detectable_details
			def detectable_details
				detectableIds = params[:detectable_ids].map{ |d| d.to_i } if params[:detectable_ids]

				render json: ::Detectable.where(id: detectableIds).to_json(:only => [:id, :name, :pretty_name])
			end
		end
	end
end
