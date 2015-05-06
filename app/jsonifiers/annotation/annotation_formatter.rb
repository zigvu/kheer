module Jsonifiers
	module Annotation
		class AnnotationFormatter

			def initialize(query)
				@query = query
			end

			def formatted
				# get all entries
				entries = @query.pluck(
					:video_id, :frame_number, :detectable_id, :chia_version_id,
					:x0, :y0, :x1, :y1, :x2, :y2, :x3, :y3)
				# format into what js expects
				# {annotations: 
				# 	{video_id: 
				# 		{frame_number: 
				# 			{detectable_id: [{
				# 				chia_version_id:, x0:, y0:, x1:, y1:, x2:, y2:, x3:, y3:
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
					chia_version_id = e[3]
					x0 = e[4]
					y0 = e[5]
					x1 = e[6]
					y1 = e[7]
					x2 = e[8]
					y2 = e[9]
					x3 = e[10]
					y3 = e[11]

					anno[video_id] = {} if anno[video_id] == nil
					anno[video_id][frame_number] = {} if anno[video_id][frame_number] == nil
					anno[video_id][frame_number][detectable_id] = [] if anno[video_id][frame_number][detectable_id] == nil

					anno[video_id][frame_number][detectable_id] << {
						chia_version_id: chia_version_id, 
						x0: x0, y0: y0, x1: x1, y1: y1, x2: x2, y2: y2, x3: x3, y3: y3
					}
				end

				return {annotations: anno}
			end

		end
	end
end