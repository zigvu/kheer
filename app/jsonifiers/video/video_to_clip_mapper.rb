module Jsonifiers
  module Video
    class VideoToClipMapper

      def initialize(videoIdFrameNumberArr)
        # format: {video_id: {clip_id: clip, }, }
        @selectedVideoClips = {}
        # format: {video_id: [clip, ]}
        @allClips = {}
        # select all clips based on videoIdFrameNumberArr
        # format of videoIdFrameNumberArr:
        # [[video_id:, frame_number], ]
        videoIdFrameNumberArr.each do |vifn|
          clipForFrame = getClip(vifn[0], vifn[1])
          @selectedVideoClips[vifn[0]] ||= {}
          @selectedVideoClips[vifn[0]][clipForFrame.id] ||= clipForFrame
        end       
      end

      def getClip(videoId, frameNumber)
        @allClips[videoId] ||= ::Video.find(videoId).clips.to_a
        @allClips[videoId].each do |clip|
          if clip.frame_number_start <= frameNumber and clip.frame_number_end >= frameNumber
            return clip
          end
        end
        nil
      end

      def formatted
        # format into what js expects
        # [
        #   { video_id:, title:, playback_frame_rate:, detection_frame_rate:, 
        #     clips: [{ clip_id:, clip_url:, clip_fn_start:, clip_fn_end:, length: }, ]
        #   },
        # ]
        # the array is sorted first by video_id and then clip_id

        videoList = []
        # sort by video_id
        @selectedVideoClips.keys().sort.each do |videoId|
          clipList = []
          # sort clips by frame_number_start
          sortedClips = Hash[@selectedVideoClips[videoId].map { |cId, c| [c.frame_number_start, c] }]
          sortedClips.keys().sort.each do |fnStart|
            clip = sortedClips[fnStart]
            clipList += [{
              clip_id: clip.id,
              clip_url: clip.clip_url,
              clip_fn_start: clip.frame_number_start,
              clip_fn_end: clip.frame_number_end,
              length: clip.length
            }]
          end

          video = ::Video.find(videoId)
          videoList += [{
            video_id: video.id,
            title: video.title,
            playback_frame_rate: video.playback_frame_rate,
            detection_frame_rate: video.detection_frame_rate,
            clips: clipList
          }]
        end
        
        return {video_list: videoList}
      end

    end
  end
end