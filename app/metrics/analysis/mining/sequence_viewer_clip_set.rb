module Metrics
  module Analysis::Mining
    class SequenceViewerClipSet

      def initialize(mining)
        @chiaVersionId = mining.chia_version_id_anno
        @videoIds = mining.video_ids

        @clips = ::Clip.where(video_id: @videoIds)

        @clipSetSize = 5
      end

      def getClipSets
        clipIdAnnoCount = getClipIdAnnoCount()
        clipSets = {}

        curClipSetIdx = 0
        clipIdAnnoCount.each do |cll|
          clipSets[curClipSetIdx] ||= []
          clipSets[curClipSetIdx] << cll
          curClipSetIdx += 1 if clipSets[curClipSetIdx].count >= @clipSetSize
        end
        clipSets
      end

      def getClipIdAnnoCount
        clipIdAnnoCount = []
        # format:
        # [{video_id:, :clip_id, :loc_count, fn_count:, fn_visited_count:}, ]
        # sorted by :clip_id
        @clips.each do |clip|
          annoCount = ::Annotation.where(clip_id: clip.id).count
          fnCount = clip.frame_number_end - clip.frame_number_start

          clipIdAnnoCount << {
            video_id: clip.video_id,
            clip_id: clip.id,
            loc_count: annoCount,
            fn_count: fnCount,
            fn_visited_count: 0
          }
        end

        clipIdAnnoCount.sort_by{ |l| l[:clip_id] }
      end

    end
  end
end