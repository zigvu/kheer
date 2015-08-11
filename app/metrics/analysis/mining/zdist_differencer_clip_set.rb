module Metrics
  module Analysis::Mining
    class ZdistDifferencerClipSet

      def initialize(mining)
        @chiaVersionId = mining.chia_version_id_loc
        @videoIds = mining.video_ids
        @filters = mining.md_zdist_differencer.confusion_filters[:filters]

        @clipSetSize = 5

        @locIntersector = Metrics::Analysis::Mining::ZdistDifferencerIntersector.new
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

      def generateQueries
        # format [[query, priZdist, secZdists, intThresh], ]
        queries = []
        # since frame numbers are not uniq across videos, we have to partition
        # by video id first
        @videoIds.each do |videoId|
          @filters.each do |filter|
            priDetId = filter[:pri_det_id]
            priZdist = filter[:selected_filters][:pri_zdist]
            priScales = filter[:selected_filters][:pri_scales]
            secZdists = filter[:selected_filters][:sec_zdists]
            intThresh = filter[:selected_filters][:int_thresh]

            q = ::Localization.where(video_id: videoId)
                .where(chia_version_id: @chiaVersionId)
                .where(detectable_id: priDetId)
                .in(scale: priScales)
            queries << [q, priZdist, secZdists, intThresh]
          end
        end
        queries
     end

      def getClipIdLocCount
        locCount = {}
        queries = generateQueries()
        queries.each do |q, priZdist, secZdists, intThresh|
          q.group_by(&:frame_number).each do |fn, localizations|
            intersections = @locIntersector.computeIntersections(
              localizations, priZdist, secZdists, intThresh)
            localizations.each do |loclz|
              if intersections[loclz.id]
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