module Jsonifiers::Mining::ZdistDifferencer
  class FullLocalizations

    def initialize(mining, setId)
      @mining = mining
      @filters = mining.md_zdist_differencer.confusion_filters[:filters]

      clipSet = @mining.clip_sets[setId.to_s]
      @clipIds = clipSet.map{ |cs| cs["clip_id"].to_i }
 
      @chiaVersionId = @mining.chia_version_id_loc

      @locIntersector = Metrics::Analysis::Mining::ZdistDifferencerIntersector.new
    end

    def generateQueries
      # format [[query, priZdist, secZdists, intThresh], ]
      queries = []
      # since each clip will have a unique frame number, we can iterate
      # over clipIds rather than videoIds
      @clipIds.each do |clipId|
        @filters.each do |filter|
          priDetId = filter[:pri_det_id]
          priZdist = filter[:selected_filters][:pri_zdist]
          priScales = filter[:selected_filters][:pri_scales]
          secZdists = filter[:selected_filters][:sec_zdists]
          intThresh = filter[:selected_filters][:int_thresh]

          q = ::Localization.where(clip_id: clipId)
              .where(chia_version_id: @chiaVersionId)
              .where(detectable_id: priDetId)
              .in(scale: priScales)
          queries << [q, priZdist, secZdists, intThresh]
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
      queries.each do |q, priZdist, secZdists, intThresh|
        q.group_by(&:frame_number).each do |fn, localizations|
          intersections = @locIntersector.computeIntersections(
            localizations, priZdist, secZdists, intThresh)
          localizations.each do |loclz|
            if intersections[loclz.id]
              addLoclzToFormatted(intersections, loclz)
            end
          end #localizations
        end #q
      end #queries
      @allFormattedLocs
    end

    def addLoclzToFormatted(intersections, loclz)
      video_id = loclz.video_id
      frame_number = loclz.frame_number
      detectable_id = loclz.detectable_id
      chia_version_id = loclz.chia_version_id
      zdist_thresh = loclz.zdist_thresh
      prob_score = loclz.prob_score
      spatial_intersection = intersections[loclz.id]
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