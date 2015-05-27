require 'json'

module Services
  module MessagingServices
    class VideoId

      def initialize
      end

      def call(message)
        # expect from python:
        # {"video_collection_id": 1, "frame_number_start": 0, "frame_number_end": 1023}
        mHash = JSON.parse(message)
        videoCollectionId = mHash["video_collection_id"].to_i
        frameNumberStart = mHash["frame_number_start"].to_i
        frameNumberEnd = mHash["frame_number_end"].to_i

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

        response = {
          video_collection_id: videoCollectionId,
          video_id: video.id,
          video_url: video.video_url
        }
        response.to_json
      end

    end
  end
end
