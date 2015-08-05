module Jsonifiers::Mining::SequenceViewer
  class FullLocalizations

    def initialize(mining, setId)
      @mining = mining
      clipSet = @mining.clip_sets[setId.to_s]
      clipIds = clipSet.map{ |cs| cs["clip_id"].to_i }

      # format:
      # {video_id: [clip1, clip2], }
      @videoIdClipMap = {}
      ::Clip.where(id: clipIds).pluck(:id, :video_id).each do |cId, vId|
        @videoIdClipMap[vId] ||= []
        @videoIdClipMap[vId] << cId
      end
    end

    def formatted
      # dataFullLocalizations: {:video_id => {:video_fn => {:detectable_id => [loclz]}}}
      #   where loclz: {chia_version_id:, zdist_thresh:, prob_score:, spatial_intersection:,
      #   scale: , x:, y:, w:, h:}
      @allFormattedLocs = {}
      @videoIdClipMap.each do |video_id, clipIds|
        clipIds.each do |clipId|
          clip = ::Clip.find(clipId)
          clipFnBegin = clip.frame_number_start
          clipFnEnd = clip.frame_number_end
          (clipFnBegin..clipFnEnd).each do |frame_number|

            @allFormattedLocs[video_id] ||= {}
            @allFormattedLocs[video_id][frame_number] ||= {}

          end # frame_number
        end # clipId
      end # video_id

      @allFormattedLocs
    end

  end
end