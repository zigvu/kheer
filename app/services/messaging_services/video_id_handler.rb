require 'json'

module Services
  module MessagingServices
    class VideoIdHandler

      def initialize
        @hdr = Messaging::Headers
      end

      def call(headers, message)
        # no need to use headers for this case
        # expect message from python:
        # { video_id:, frame_number_start:, frame_number_end: }
        mHash = JSON.parse(message)
        videoCollectionId = mHash['video_id'].to_i
        frameNumberStart = mHash['frame_number_start'].to_i
        frameNumberEnd = mHash['frame_number_end'].to_i

        vc = VideoCollection.find(videoCollectionId)
        video = vc.videos
          .where(frame_number_start: frameNumberStart, frame_number_end: frameNumberEnd)
          .first

        if video == nil
          length = (frameNumberEnd - frameNumberStart + 1) * 1000.0 / vc.playback_frame_rate
          video = vc.videos.create(
            length: length, 
            frame_number_start: frameNumberStart, 
            frame_number_end: frameNumberEnd
          )
          # get convention from python
          videoURL = "/data/#{videoCollectionId}/videos/#{video.id}.mp4"
          video.update(video_url: videoURL)
        end

        responseHeaders = @hdr.getStatusSuccess()
        responseMessage = {
          video_id: videoCollectionId,
          quanta_id: video.id,
          quanta_url: video.video_url
        }
        return responseHeaders, responseMessage.to_json
      end

    end
  end
end
