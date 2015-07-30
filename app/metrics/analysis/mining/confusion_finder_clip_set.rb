module Metrics
  module Analysis::Mining
    class ConfusionFinderClipSet

      def initialize(mining)
        @chiaVersionId = mining.chia_version_id_loc
        @videoIds = mining.video_ids
        @filters = mining.md_confusion_finder.confusion_filters[:filters]

        @clipSetSize = 5

        @locIntersector = Metrics::Analysis::Mining::ConfusionFinderIntersector.new
      end

      def getClipSets
        clipIdLocCount = getClipIdLocCount()
        clipSets = {}

        curClipSetIdx = 0
        clipIdLocCount.each do |cll|
          clipSets[curClipSetIdx] ||= []
          clipSets[curClipSetIdx] << cll
          curClipSetIdx += 1 if clipSets[curClipSetIdx].count >= @clipSetSize
        end
        clipSets
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

      def getClipIdLocCount
        locCount = {}
        queries = generateQueries()
        queries.each do |q, intThreshs|
          q.group_by(&:frame_number).each do |fn, localizations|
            intersections = @locIntersector.computeIntersections(localizations)
            localizations.each do |loclz|
              if intThreshs.include?(intersections[loclz.id])

                locCount[loclz.video_id] ||= {}
                if locCount[loclz.video_id][loclz.clip_id] == nil
                  locCount[loclz.video_id][loclz.clip_id] = {}
                  locCount[loclz.video_id][loclz.clip_id][:loc_count] = 0
                  locCount[loclz.video_id][loclz.clip_id][:fns] = []
                end

                locCount[loclz.video_id][loclz.clip_id][:loc_count] += 1
                locCount[loclz.video_id][loclz.clip_id][:fns] << fn
              end
            end #localizations
          end #q
        end

        clipIdLocCount = []
        # format:
        # [{video_id:, :clip_id, :loc_count, fn_count:, fn_visited_count:}, ]
        # sorted by :loc_count
        locCount.each do |vId, cIdCnt|
          cIdCnt.each do |cId, cIdVal|
            locCnt = cIdVal[:loc_count]
            fnCnt = cIdVal[:fns].uniq.count
            clipIdLocCount << {
              video_id: vId,
              clip_id: cId,
              loc_count: locCnt,
              fn_count: fnCnt,
              fn_visited_count: 0
            }
          end
        end
        clipIdLocCount.sort_by{ |l| l[:loc_count] }.reverse
      end

    end
  end
end