module Jsonifiers::Mining::DetFinder
  class FullLocalizations

    def initialize(mining, setId)
      @mining = mining

      @detectableIds = @mining.md_det_finder.detectable_ids
      @priZdist = @mining.md_det_finder.pri_zdist
      @secZdist = @mining.md_det_finder.sec_zdist

      clipSet = @mining.clip_sets[setId.to_s]
      @clipIds = clipSet.map{ |cs| cs["clip_id"].to_i }
 
      @chiaVersionId = @mining.chia_version_id_loc

      @intThresh = 0
      @locIntersector = Metrics::Analysis::Mining::ZdistDifferencerIntersector.new
    end

    def generateQueries
      # format [query]
      queries = []
      # since each clip will have a unique frame number, we can iterate
      # over clipIds rather than videoIds
      @clipIds.each do |clipId|
        @detectableIds.each do |detectableId|
          q = ::Localization.where(clip_id: clipId)
              .where(chia_version_id: @chiaVersionId)
              .where(detectable_id: detectableId)
              .in(zdist_thresh: [@priZdist, @secZdist])
          queries << q
        end
      end
      queries
   end

    def formatted
      # dataFullLocalizations: {:video_id => {:video_fn => {:detectable_id => [loclz]}}}
      #   where loclz: {chia_version_id:, zdist_thresh:, prob_score:, spatial_intersection:,
      #   scale: , x:, y:, w:, h:}
      @allFormattedLocs = {}
      queries = generateQueries()
      queries.each do |q|
        q.group_by(&:frame_number).each do |fn, localizations|
          intersections = @locIntersector.computeIntersections(
            localizations, @priZdist, [@secZdist], @intThresh)
          localizations.each do |loclz|
            if intersections[loclz.id]
              addLoclzToFormatted(loclz, 0.5)
            else
              addLoclzToFormatted(loclz, 1.0)
            end
          end #localizations
        end #q
      end #queries
      @allFormattedLocs
    end

    def addLoclzToFormatted(loclz, intersection)
      video_id = loclz.video_id
      frame_number = loclz.frame_number
      detectable_id = loclz.detectable_id
      chia_version_id = loclz.chia_version_id
      zdist_thresh = loclz.zdist_thresh
      prob_score = loclz.prob_score
      spatial_intersection = intersection
      scale = loclz.scale
      x = loclz.x
      y = loclz.y
      w = loclz.w
      h = loclz.h

      @allFormattedLocs[video_id] ||= {}
      @allFormattedLocs[video_id][frame_number] ||= {}
      @allFormattedLocs[video_id][frame_number][detectable_id] ||= []

      @allFormattedLocs[video_id][frame_number][detectable_id] << {
        chia_version_id: chia_version_id,
        zdist_thresh: zdist_thresh, prob_score: prob_score, 
        spatial_intersection: spatial_intersection,
        scale: scale, x: x, y: y, w: w, h: h
      }
    end

  end
end
