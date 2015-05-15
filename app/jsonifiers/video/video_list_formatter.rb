module Jsonifiers
	module Video
		class VideoListFormatter

			def initialize(videoIds)
				@query = ::Video.find(videoIds)
			end

			def formatted
				# format into what js expects
				# [
				# 	{
				#      video_collection_id:, video_id:, video_url:, playback_frame_rate:, 
				#      detection_frame_rate:, frame_number_start:, frame_number_end:, :length
			  #   }, 
				# ]

				vl = []
				# get all entries
				@query.each do |v|
					vc = v.video_collection
					vl += [{
						video_collection_id: vc.id,
						video_id: v.id,
						video_url: v.video_url,
						playback_frame_rate: vc.playback_frame_rate,
						detection_frame_rate: vc.detection_frame_rate,
						frame_number_start: v.frame_number_start,
						frame_number_end: v.frame_number_end,
						length: v.length
					}]
				end
				
				return {video_list: vl}
			end

		end
	end
end