module Jsonifiers
	module Localization
		class LocalizationFormatter

			def initialize(query)
				@query = query
			end

			def formatted
				# get all entries
				entries = @query.pluck(
					:video_id, :frame_number, :detectable_id, :chia_version_id,
					:zdist_thresh, :scale, :prob_score, 
					:x, :y, :w, :h)
				# format into what js expects
	      # {localizations: {:video_id => {:video_fn => {:detectable_id => [loclz]}}}
	      #   where loclz: {chia_version_id:, zdist_thresh:, prob_score:, spatial_intersection:,
	      #   scale: , x:, y:, w:, h:}
	      # }
				
				loc = {}
				entries.each do |e|
					video_id = e[0]
					frame_number = e[1]
					detectable_id = e[2]
					chia_version_id = e[3]
					zdist_thresh = e[4]
					scale = e[5]
					prob_score = e[6]
					x = e[7]
					y = e[8]
					w = e[9]
					h = e[10]

					loc[video_id] = {} if loc[video_id] == nil
					loc[video_id][frame_number] = {} if loc[video_id][frame_number] == nil
					loc[video_id][frame_number][detectable_id] = [] if loc[video_id][frame_number][detectable_id] == nil

					loc[video_id][frame_number][detectable_id] << {
						chia_version_id: chia_version_id, zdist_thresh: zdist_thresh, 
						scale: scale, prob_score: prob_score, x: x, y: y, w: w, h: h
					}
				end

				return {localizations: loc}
			end

		end
	end
end