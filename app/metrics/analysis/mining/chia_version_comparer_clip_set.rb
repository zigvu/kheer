module Metrics
  module Analysis::Mining
    class ChiaVersionComparerClipSet

      def initialize(mining)
        @chiaVersionIdLoc = mining.chia_version_id_loc
        @chiaVersionIdSec = mining.md_chia_version_comparer.chia_version_id_sec
        @videoIds = mining.video_ids

        @detIdZdistsLoc = mining.md_chia_version_comparer.zdist_threshs_loc
        @detIdZdistsSec = mining.md_chia_version_comparer.zdist_threshs_sec

        @clipIds = ::Clip.where(video_id: @videoIds).pluck(:id)

        @clipSetSize = 5
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

      def getClipIdLocCount
        locCount = {}
        @detIdZdistsLoc.each do |detId, zdistLoc|
          # get counts of primary chia version localization bboxes
          cIdsVids = ::Localization.in(clip_id: @clipIds)
              .where(chia_version_id: @chiaVersionIdLoc)
              .where(detectable_id: detId)
              .where(zdist_thresh: zdistLoc)
              .pluck(:video_id, :clip_id, :frame_number)
          cIdsVids.each do |vId, cId, fn|
            locCount[vId] ||= {}
            locCount[vId][cId] ||= {}
            if locCount[vId][cId][fn] == nil
              locCount[vId][cId][fn] = {}
              locCount[vId][cId][fn][:loc_count] = 0
              locCount[vId][cId][fn][:sec_count] = 0
              locCount[vId][cId][fn][:diff_count] = 0
            end
            locCount[vId][cId][fn][:loc_count] += 1
          end

          # get counts of secondary chia version localization bboxes
          zdistSec = @detIdZdistsSec[detId]
          cIdsVids = ::Localization.in(clip_id: @clipIds)
              .where(chia_version_id: @chiaVersionIdSec)
              .where(detectable_id: detId)
              .where(zdist_thresh: zdistSec)
              .pluck(:video_id, :clip_id, :frame_number)
          cIdsVids.each do |vId, cId, fn|
            locCount[vId] ||= {}
            locCount[vId][cId] ||= {}
            if locCount[vId][cId][fn] == nil
              locCount[vId][cId][fn] = {}
              locCount[vId][cId][fn][:loc_count] = 0
              locCount[vId][cId][fn][:sec_count] = 0
              locCount[vId][cId][fn][:diff_count] = 0
            end
            locCount[vId][cId][fn][:sec_count] += 1
          end

          # store difference between primary and secondary bbox counts
          locCount.each do |vId, cIdCnt|
            cIdCnt.each do |cId, fnCnt|
              fnCnt.each do |fn, fnVal|
                locCnt = fnVal[:loc_count]
                secCnt = fnVal[:sec_count]
                locCount[vId][cId][fn][:diff_count] += (locCnt - secCnt).abs
              end
            end
          end
        end

        clipIdLocCount = []
        # format:
        # [{video_id:, :clip_id, :loc_count, fn_count:, fn_visited_count:}, ]
        # sorted by :loc_count
        locCount.each do |vId, cIdCnt|
          cIdCnt.each do |cId, fnCnt|
            diffCount = 0
            fnCount = 0
            fnCnt.each do |fn, fnVal|
              diffCount += fnVal[:diff_count]
              fnCount += 1
            end
            clipIdLocCount << {
              video_id: vId,
              clip_id: cId,
              loc_count: diffCount,
              fn_count: fnCount,
              fn_visited_count: 0
            }            
          end
        end

        clipIdLocCount.sort_by{ |l| l[:loc_count] }.reverse
      end

    end
  end
end