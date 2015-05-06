module Jsonifiers
	module Video
		class VideoDataMapParamsParser

			attr_accessor :videoIds

			def initialize(videoDataMapParams)
				# expect: array of id numbers
				@videoIds = videoDataMapParams['video_ids'].map{ |s| s.to_i } if videoDataMapParams['video_ids']
			end

		end
	end
end