module Annotators
	module Formatters
		class FilterQueryLocalizationFormatter

			def initialize(query)
				@query = query
			end

			def formatted
				# get all entries
				entries = @query.pluck(
					:video_id, :frame_number, :detectable_id, 
					:zdist_thresh, :scale, :prob_score, 
					:x, :y, :w, :h)
				# format into what js expects
				# {localizations: 
				# 	{video_id: 
				# 		{frame_number: 
				# 			{detectable_id: [{
				# 				zdist_thresh:, scale:, prob_score:, x:, y:, w:, h:
				# 				}, ...]
				# 			}
				# 		}
				# 	}
				# }
				
				loc = {}
				entries.each do |e|
					video_id = e[0]
					frame_number = e[1]
					detectable_id = e[2]
					zdist_thresh = e[3]
					scale = e[4]
					prob_score = e[5]
					x = e[6]
					y = e[7]
					w = e[8]
					h = e[9]

					loc[video_id] = {} if loc[video_id] == nil
					loc[video_id][frame_number] = {} if loc[video_id][frame_number] == nil
					loc[video_id][frame_number][detectable_id] = [] if loc[video_id][frame_number][detectable_id] == nil

					loc[video_id][frame_number][detectable_id] << {
						zdist_thresh: zdist_thresh, scale: scale, prob_score: prob_score, x: x, y: y, w: w, h: h
					}
				end

				return {localizations: loc}
			end

		end
	end
end