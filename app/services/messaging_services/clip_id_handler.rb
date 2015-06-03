require 'json'

module Services
  module MessagingServices
    class ClipIdHandler

      def initialize
        @hdr = Messaging::Headers
      end

      def call(headers, message)
        # no need to use headers for this case
        # expect message from python:
        # { video_id:, frame_number_start:, frame_number_end: }
        mHash = JSON.parse(message)
        videoId = mHash['video_id'].to_i
        frameNumberStart = mHash['frame_number_start'].to_i
        frameNumberEnd = mHash['frame_number_end'].to_i

        video = Video.find(videoId)
        clip = video.clips
          .where(frame_number_start: frameNumberStart, frame_number_end: frameNumberEnd)
          .first

        if clip == nil
          length = (frameNumberEnd - frameNumberStart + 1) * 1000.0 / video.playback_frame_rate
          clip = video.clips.create(
            length: length, 
            frame_number_start: frameNumberStart, 
            frame_number_end: frameNumberEnd
          )
          # get convention from python
          clipURL = "/data/#{videoId}/clips/#{clip.id}.mp4"
          clip.update(clip_url: clipURL)
        end

        responseHeaders = @hdr.getStatusSuccess()
        responseMessage = {
          video_id: videoId,
          clip_id: clip.id,
          clip_url: clip.clip_url
        }
        return responseHeaders, responseMessage.to_json
      end

    end
  end
end
