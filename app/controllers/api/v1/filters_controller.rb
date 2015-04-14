module Api
	module V1
		class FiltersController < ApplicationController

			before_filter :ensure_json_format

			def new
				render json: {ack: 'ok'}.to_json
			end

			def video_data_map
				# TODO: 
				videoDataMap = [
					{video_id: 1, video_URL: '/data/2.mp4', frame_rate: 25},
					{video_id: 2, video_URL: '/data/2.mp4', frame_rate: 25},
					{video_id: 3, video_URL: '/data/2.mp4', frame_rate: 25}
				];
				render json: {video_data_map: videoDataMap}.to_json
			end

			def filtered_summary
				filter = Filters::FilterParser.new(params[:filter])
				fql = Filters::FilterQueryLocalization.new(filter).run()

				fqlLocalizationCount = fql.count
				fqlVideoCount = fql.pluck(:video_id).uniq.count
				fqlFrameCount = fql.pluck(:frame_number).uniq.count

				render json: {
					:'Localization Count' => fqlLocalizationCount,
					:'Video Count' => fqlVideoCount,
					:'Frame Count' => fqlFrameCount
				}.to_json
			end

			def filtered_data
				filter = Filters::FilterParser.new(params[:filter])
				fql = Filters::FilterQueryLocalization.new(filter).run()
				formatted = Filters::FilterQueryLocalizationFormatter.new(fql).formatted()

				render json: formatted.to_json
			end

			def detectables
				chiaVersionId = filter_params[:chia_version_id]
				@detectables = ::Detectable.where(chia_version_id: chiaVersionId)
				render json: @detectables.to_json(:only => [:id, :name, :pretty_name, :chia_detectable_id])
			end

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
