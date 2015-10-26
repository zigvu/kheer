module Metrics
  module Analysis::Mining
    class DetFinderClipSet

      def initialize(mining)
        @chiaVersionId = mining.chia_version_id_loc
        @videoIds = mining.video_ids
        @detectableIds = mining.md_det_finder.detectable_ids
        @priZdist = mining.md_det_finder.pri_zdist
        @secZdist = mining.md_det_finder.sec_zdist

        @clipSetSize = 5

        @intThresh = 0
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
        # format [query]
        queries = []
        # since frame numbers are not uniq across videos, we have to partition
        # by video id first
        @videoIds.each do |videoId|
          @detectableIds.each do |detectableId|
            # within each video select only those clips that have at least one
            # localization at secondary zdist
            clipIds = ::Localization.where(video_id: videoId)
                .where(chia_version_id: @chiaVersionId)
                .where(detectable_id: detectableId)
                .where(zdist_thresh: @secZdist)
                .pluck(:clip_id).uniq

            q = ::Localization.in(clip_id: clipIds)
                .where(chia_version_id: @chiaVersionId)
                .where(detectable_id: detectableId)
                .in(zdist_thresh: [@priZdist, @secZdist])
            queries << q
          end
        end
        queries
     end

      def getClipIdLocCount
        locCount = {}
        queries = generateQueries()
        queries.each do |q|
          q.group_by(&:frame_number).each do |fn, localizations|
            intersections = @locIntersector.computeIntersections(
              localizations, @priZdist, [@secZdist], @intThresh)
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
        # sorted by :clip_id
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
        clipIdLocCount.sort_by{ |l| l[:clip_id] }
      end

    end
  end
end