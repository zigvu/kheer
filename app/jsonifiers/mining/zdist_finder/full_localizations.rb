module Jsonifiers::Mining::ZdistFinder
  class FullLocalizations

    def initialize(mining, setId)
      @mining = mining
      clipSet = @mining.clip_sets[setId.to_s]
      @clipIds = clipSet.map{ |cs| cs["clip_id"].to_i }
      @videoIds = Clip.where(id: @clipIds).pluck(:video_id).uniq.sort

      @chiaVersionId = @mining.chia_version_id_loc

      # we ignore same class intersection
      @locIntersector = Metrics::Analysis::Mining::ZdistFinderIntersector.new
      @zdistDetIds = Metrics::Analysis::ZdistValuesConsolidator.new(
        @mining.md_zdist_finder.zdist_threshs).zdistDetId
    end

    def generateQueries
      queries = []
      # since frame numbers are not uniq across videos, we have to partition
      # by video id first
      @videoIds.each do |videoId|
        @zdistDetIds.each do |zdist, detIds|
          queries << ::Localization.in(clip_id: @clipIds)
              .where(video_id: videoId)
              .where(chia_version_id: @chiaVersionId)
              .in(detectable_id: detIds)
              .where(zdist_thresh: zdist)
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
          intersections = @locIntersector.computeIntersections(localizations)
          localizations.each do |loclz|
            addLoclzToFormatted(intersections, loclz)
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