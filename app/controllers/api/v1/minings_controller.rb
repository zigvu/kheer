module Api
	module V1
		class MiningsController < ApplicationController

			before_filter :ensure_json_format
			before_action :set_mining

			# GET api/v1/minings/show
			def show
				m = Jsonifiers::Mining::Common::SetDetails.new(@mining, @setId)
				render json: m.formatted.to_json
			end

			# GET api/v1/minings/full_localizations
			def full_localizations
				m = @mTypeModule::FullLocalizations.new(@mining, @setId)
				render json: m.formatted.to_json
			end

			# GET api/v1/minings/full_annotations
			def full_annotations
				m = Jsonifiers::Mining::Common::FullAnnotations.new(@mining, @setId)
				render json: m.formatted.to_json
			end

			# GET api/v1/minings/color_map
			def color_map
				chiaVersion = @mining.chiaVersionLoc
				colorMap = chiaVersion.color_map.color_map
				render json: colorMap.to_json
			end

			# GET api/v1/minings/cell_map
			def cell_map
				chiaVersion = @mining.chiaVersionLoc
				cellMap = chiaVersion.cell_map.cell_map
				render json: cellMap.to_json
			end

			# GET api/v1/minings/confusion
			def confusion
        chiaVersionId = @mining.chia_version_id_loc
        videoIds = @mining.video_ids

	      chiaVersion = ::ChiaVersion.find(chiaVersionId)
	      detectableIds = chiaVersion.chia_version_detectables.pluck(:detectable_id)
	      detectableIdNameMap = Hash[::Detectable.where(id: detectableIds).pluck(:id, :pretty_name)]

	      # play nice with float hash keys
	      priZdist = params['current_filters']['pri_zdist'].to_f.round(1)
	      priScales = params['current_filters']['pri_scales'].map{ |s| s.to_f.round(1) }
	      secZdist = params['current_filters']['sec_zdist'].to_f.round(1)
	      secScales = params['current_filters']['sec_scales'].map{ |s| s.to_f.round(1) }
	      intThreshs = params['current_filters']['int_threshs'].map{ |i| i.to_f.round(1) }

	      # puts "priZdist #{priZdist}, priScales #{priScales}, secZdist #{secZdist}, secScales #{secScales}, intThreshs #{intThreshs}"

	      mv = ::Metrics::Analysis::VideosDetails.new(chiaVersionId, videoIds)
	      confusionMatrix = mv.getConfusionMatrix(priZdist, priScales, secZdist, secScales, intThreshs)
	      render json: {
	        intersections: confusionMatrix,
	        detectable_map: detectableIdNameMap
	      }.to_json
			end

			private
				# Use callbacks to share common setup or constraints between actions.
				def set_mining
					miningId = params['mining_id']
					@setId = params['set_id']
					@mining = ::Mining.find(miningId)
					if States::MiningType.new(@mining).isZdistFinder?
						@mTypeModule = Jsonifiers::Mining::ZdistFinder
					elsif States::MiningType.new(@mining).isChiaVersionComparer?
						@mTypeModule = Jsonifiers::Mining::ChiaVersionComparer
					elsif States::MiningType.new(@mining).isZdistDifferencer?
						@mTypeModule = Jsonifiers::Mining::ZdistDifferencer
					elsif States::MiningType.new(@mining).isConfusionFinder?
						@mTypeModule = Jsonifiers::Mining::ConfusionFinder
					elsif States::MiningType.new(@mining).isSequenceViewer?
						@mTypeModule = Jsonifiers::Mining::SequenceViewer
					end
				end

		end
	end
end
