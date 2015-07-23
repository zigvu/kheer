module Jsonifiers::Mining::ChiaVersionComparer
  class FullLocalizations

    def initialize(mining, setId)
      @mining = mining
      clipSet = @mining.clip_sets[setId.to_s]
      @clipIds = clipSet.map{ |cs| cs["clip_id"].to_i }
      @videoIds = Clip.where(id: @clipIds).pluck(:video_id).uniq.sort

      @chiaVersionIdPri = mining.chia_version_id_loc
      @chiaVersionIdSec = mining.md_chia_version_comparer.chia_version_id_sec

      @detIdZdistsPri = mining.md_chia_version_comparer.zdist_threshs_loc
      @detIdZdistsSec = mining.md_chia_version_comparer.zdist_threshs_sec

      @locIntersector = Metrics::Analysis::Mining::ChiaVersionComparerIntersector.new
    end

    def generateQueries
      queries = []
      # since frame numbers are not uniq across videos, we have to partition
      # by video id first
      @videoIds.each do |videoId|
        @detIdZdistsPri.each do |detId, zdistLoc|
          # get counts of primary chia version localization bboxes
          qPri = ::Localization.in(clip_id: @clipIds)
              .where(video_id: videoId)
              .where(chia_version_id: @chiaVersionIdPri)
              .where(detectable_id: detId)
              .where(zdist_thresh: zdistLoc)
          # get counts of secondary chia version localization bboxes
          zdistSec = @detIdZdistsSec[detId]
          qSec = ::Localization.in(clip_id: @clipIds)
              .where(video_id: videoId)
              .where(chia_version_id: @chiaVersionIdSec)
              .where(detectable_id: detId)
              .where(zdist_thresh: zdistSec)
          queries << [qPri, qSec]
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
      queries.each do |qPri, qSec|
        qPriLocs = qPri.group_by(&:frame_number)
        qSecLocs = qSec.group_by(&:frame_number)
        allFns = qPriLocs.keys + qSecLocs.keys
        allFns.each do |fn|
          priLocs = qPriLocs[fn]
          secLocs = qSecLocs[fn]
          # if both arrays are not empty
          if priLocs != nil and secLocs != nil
            intersections = @locIntersector.computeIntersections(priLocs, secLocs)
            priLocs.each do |loclz|
              addLoclzToFormatted(intersections, loclz)
            end
            secLocs.each do |loclz|
              addLoclzToFormatted(intersections, loclz)
            end
          elsif priLocs != nil
            priLocs.each do |loclz|
              addLoclzToFormatted(nil, loclz)
            end
          elsif secLocs != nil
            secLocs.each do |loclz|
              addLoclzToFormatted(nil, loclz)
            end
          end

        end #allFns
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
      spatial_intersection = intersections ? (1 - intersections[loclz.id]) : 1
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