module Api
	module V1
		class FiltersController < ApplicationController

			before_filter :ensure_json_format

			# unused
			def new
				render json: {ack: 'ok'}.to_json
			end

			# GET api/v1/filters/video_data_map
			def video_data_map
				vdmp = Annotators::Parsers::VideoDataMapParser.new(params[:video_data_map])
				vdmq = Annotators::Queries::VideoDataMapQuery.new(vdmp).run()
				formatted = Annotators::Formatters::VideoDataMapQueryFormatter.new(vdmq).formatted()

				render json: formatted.to_json
			end

			# POST api/v1/filters/filtered_summary
			def filtered_summary
				filter = Annotators::Parsers::FilterParser.new(params[:filter])
				fql = Annotators::Queries::FilterQueryLocalization.new(filter).run()
				fqa = Annotators::Queries::FilterQueryAnnotation.new(filter).run()

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
				filter = Annotators::Parsers::FilterParser.new(params[:filter])
				fql = Annotators::Queries::FilterQueryLocalization.new(filter).run()
				formattedLocs = Annotators::Formatters::FilterQueryLocalizationFormatter.new(fql).formatted()

				fqa = Annotators::Queries::FilterQueryAnnotation.new(filter).run()
				formattedAnno = Annotators::Formatters::FilterQueryAnnotationFormatter.new(fqa).formatted()

				formatted = formattedLocs.merge(formattedAnno)
				render json: formatted.to_json
			end

			# GET api/v1/filters/color_map
			def color_map
				chiaVersionId = filter_params[:chia_version_id]
				colorMap = ::ChiaVersion.find(chiaVersionId).patch_map.color_map
				render json: {color_map: colorMap}.to_json
			end

			# GET api/v1/filters/cell_map
			def cell_map
				chiaVersionId = filter_params[:chia_version_id]
				cellMap = {}
				::ChiaVersion.find(chiaVersionId).cell_map.cell_boxes.each do |cb|
					cellMap[cb.cell_idx] = {x: cb.x, y: cb.y, w: cb.w, h: cb.h}
				end
				render json: {cell_map: cellMap}.to_json
			end

			# GET api/v1/filters/detectables
			def detectables
				chiaVersionId = filter_params[:chia_version_id]
				@detectables = ::Detectable.where(chia_version_id: chiaVersionId)
				render json: @detectables.to_json(:only => [:id, :name, :pretty_name, :chia_detectable_id])
			end

			# GET api/v1/filters/chia_versions
			def chia_versions
				@chiaVersions = ::ChiaVersion.all
				render json: @chiaVersions.to_json(:only => [:id, :name, :description, :settings])
			end

			private

				# Only allow a trusted parameter "white list" through.
				def filter_params
					params.permit(:filter, :chia_version_id, :detectable_ds)
				end

		end
	end
end
