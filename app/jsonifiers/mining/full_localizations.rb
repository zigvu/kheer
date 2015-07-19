module Jsonifiers
  module Mining
    class FullLocalizations

      def initialize(miningId, setId)
        @mining = ::Mining.find(miningId)
        clipSet = @mining.clip_sets[setId.to_s]
        @clipIds = clipSet.map{ |cs| cs["clip_id"].to_i }
        @chiaVersionId = @mining.chia_version_id_loc

        @locIntersector = Metrics::Analysis::LocalizationIntersector.new
      end

      def generateQueries
        queries = []
        zdistDetId = Metrics::Analysis::ZdistValuesConsolidator.new(@mining.zdist_threshs).zdistDetId
        zdistDetId.each do |zdist, detIds|
          queries << ::Localization.in(clip_id: @clipIds)
              .where(chia_version_id: @chiaVersionId)
              .in(detectable_id: detIds)
              .where(zdist_thresh: zdist)
        end
        queries
     end

      def formatted
        # dataFullLocalizations: {:video_id => {:video_fn => {:detectable_id => [loclz]}}}
        #   where loclz: {zdist_thresh:, prob_score:, spatial_intersection:,
        #   scale: , x:, y:, w:, h:}
        loc = {}
        queries = generateQueries()
        queries.each do |q|
          q.group_by(&:frame_number).each do |fn, localizations|
            intersections = @locIntersector.computeIntersections(localizations)
            localizations.each do |loclz|
              video_id = loclz.video_id
              frame_number = loclz.frame_number
              detectable_id = loclz.detectable_id
              zdist_thresh = loclz.zdist_thresh
              prob_score = loclz.prob_score
              spatial_intersection = intersections[loclz.id]
              scale = loclz.scale
              x = loclz.x
              y = loclz.y
              w = loclz.w
              h = loclz.h

              loc[video_id] = {} if loc[video_id] == nil
              loc[video_id][frame_number] = {} if loc[video_id][frame_number] == nil
              loc[video_id][frame_number][detectable_id] = [] if loc[video_id][frame_number][detectable_id] == nil

              loc[video_id][frame_number][detectable_id] << {
                zdist_thresh: zdist_thresh, prob_score: prob_score, 
                spatial_intersection: spatial_intersection,
                scale: scale, x: x, y: y, w: w, h: h
              }
            end #localizations
          end #q
        end #queries
        loc
      end

    end
  end
end