module Annotators
	module Formatters
		class FilterQueryAnnotationFormatter

			def initialize(query)
				@query = query
			end

			def formatted
				# get all entries
				entries = @query.pluck(
					:video_id, :frame_number, :detectable_id, 
					:x0, :y0, :x1, :y1, :x2, :y2, :x3, :y3)
				# format into what js expects
				# {annotations: 
				# 	{video_id: 
				# 		{frame_number: 
				# 			{detectable_id: [{
				# 				x0:, y0:, x1:, y1:, x2:, y2:, x3:, y3:
				# 				}, ...]
				# 			}
				# 		}
				# 	}
				# }
				
				anno = {}
				entries.each do |e|
					video_id = e[0]
					frame_number = e[1]
					detectable_id = e[2]
					x0 = e[3]
					y0 = e[4]
					x1 = e[5]
					y1 = e[6]
					x2 = e[7]
					y2 = e[8]
					x3 = e[9]
					y3 = e[10]

					anno[video_id] = {} if anno[video_id] == nil
					anno[video_id][frame_number] = {} if anno[video_id][frame_number] == nil
					anno[video_id][frame_number][detectable_id] = [] if anno[video_id][frame_number][detectable_id] == nil

					anno[video_id][frame_number][detectable_id] << {
						x0: x0, y0: y0, x1: x1, y1: y1, x2: x2, y2: y2, x3: x3, y3: y3
					}
				end

				return {annotations: anno}
			end

		end
	end
end