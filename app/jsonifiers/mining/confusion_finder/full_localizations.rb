module Jsonifiers::Mining::ConfusionFinder
  class FullLocalizations

    def initialize(mining, setId)
      @mining = mining
      @filters = mining.md_confusion_finder.confusion_filters[:filters]

      clipSet = @mining.clip_sets[setId.to_s]
      @clipIds = clipSet.map{ |cs| cs["clip_id"].to_i }
      @videoIds = Clip.where(id: @clipIds).pluck(:video_id).uniq.sort

      @chiaVersionId = @mining.chia_version_id_loc

      @locIntersector = Metrics::Analysis::Mining::ConfusionFinderIntersector.new
    end

    def generateSingleQuery(filter)
      f = filter
      ::Localization.or(
        ::Localization.where(detectable_id: f[:pri_det_id])
          .where(zdist_thresh: f[:selected_filters][:pri_zdist])
          .in(scale: f[:selected_filters][:pri_scales]).selector,
        ::Localization.where(detectable_id: f[:sec_det_id])
          .where(zdist_thresh: f[:selected_filters][:sec_zdist])
          .in(scale: f[:selected_filters][:sec_scales]).selector
        )
    end

    def generateQueries
      # format [[query, intThreshs], ]
      queries = []
      # since frame numbers are not uniq across videos, we have to partition
      # by video id first
      @videoIds.each do |videoId|
        @filters.each do |filter|
          intThreshs = filter[:selected_filters][:int_threshs]
          q = generateSingleQuery(filter).where(video_id: videoId).where(chia_version_id: @chiaVersionId)
          queries << [q, intThreshs]
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
      queries.each do |q, intThreshs|
        q.group_by(&:frame_number).each do |fn, localizations|
          intersections = @locIntersector.computeIntersections(localizations, intThreshs)
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