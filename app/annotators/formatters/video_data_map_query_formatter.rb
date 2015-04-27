module Annotators
	module Formatters
		class VideoDataMapQueryFormatter

			def initialize(query)
				@query = query
			end

			def formatted
				# format into what js expects
				# {video_id: 
				# 	{
				#      video_url:, playback_frame_rate:, detection_frame_rate:, 
				#      frame_number_start:, frame_number_end:
			  #   }
				# }

				vdm = {}
				# get all entries
				@query.each do |v|
					vc = v.video_collection
					vdm[v.id] = {
						video_url: v.video_url,
						playback_frame_rate: vc.playback_frame_rate,
						detection_frame_rate: vc.detection_frame_rate,
						frame_number_start: v.frame_number_start,
						frame_number_end: v.frame_number_end
					}
				end
				
				return {video_data_map: vdm}
			end

		end
	end
end