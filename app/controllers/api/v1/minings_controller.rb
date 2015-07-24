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

			# GET api/v1/filters/color_map
			def color_map
				chiaVersion = @mining.chiaVersionLoc
				colorMap = chiaVersion.color_map.color_map
				render json: colorMap.to_json
			end

			# GET api/v1/filters/cell_map
			def cell_map
				chiaVersion = @mining.chiaVersionLoc
				cellMap = chiaVersion.cell_map.cell_map
				render json: cellMap.to_json
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
					end
				end

		end
	end
end
