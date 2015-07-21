module DataImporters
	class VideoClipMap

		def initialize
			@videoFnClipId = {}
		end

		def getClipId(videoId, videoFn)
			clipId = nil
			getVideoFnClipIds(videoId).each do |clId, fnStart, fnEnd|
				if videoFn >= fnStart and videoFn <= fnEnd
					clipId = clId
					break
				end
			end
			clipId
		end

		private
			def getVideoFnClipIds(videoId)
				if @videoFnClipId[videoId] == nil
					@videoFnClipId[videoId] = ::Video.find(videoId).clips
							.order(:frame_number_start)
							.pluck(:id, :frame_number_start, :frame_number_end)
				end
				@videoFnClipId[videoId]
			end

	end
end
