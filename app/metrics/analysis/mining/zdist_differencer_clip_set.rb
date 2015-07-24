module Metrics
  module Analysis::Mining
    class ZdistDifferencerClipSet

      def initialize(mining)
        @chiaVersionId = mining.chia_version_id_loc
        @videoIds = mining.video_ids
        @detIdZdistsPri = mining.md_zdist_differencer.zdist_threshs_pri
        @detIdZdistsSec = mining.md_zdist_differencer.zdist_threshs_sec

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
        @detIdZdistsPri.each do |detId, zdistPri|
          # get counts of primary localization bboxes
          cIdsVids = ::Localization.in(clip_id: @clipIds)
              .where(chia_version_id: @chiaVersionId)
              .where(detectable_id: detId)
              .where(zdist_thresh: zdistPri)
              .pluck(:video_id, :clip_id, :frame_number)
          cIdsVids.each do |vId, cId, fn|
            locCount[vId] ||= {}
            locCount[vId][cId] ||= {}
            if locCount[vId][cId][detId] == nil
              locCount[vId][cId][detId] = {}
              locCount[vId][cId][detId][:pri_fns] = []
              locCount[vId][cId][detId][:sec_fns] = []
              locCount[vId][cId][detId][:diff_fns] = []
              locCount[vId][cId][detId][:pri_loc_count] = 0
              locCount[vId][cId][detId][:sec_loc_count] = 0
              locCount[vId][cId][detId][:diff_loc_count] = 0
            end
            locCount[vId][cId][detId][:pri_fns] << fn
            locCount[vId][cId][detId][:pri_loc_count] += 1
          end

          # get counts of secondary localization bboxes
          zdistSec = @detIdZdistsSec[detId]
          cIdsVids = ::Localization.in(clip_id: @clipIds)
              .where(chia_version_id: @chiaVersionId)
              .where(detectable_id: detId)
              .where(zdist_thresh: zdistSec)
              .pluck(:video_id, :clip_id, :frame_number)
          cIdsVids.each do |vId, cId, fn|
            locCount[vId] ||= {}
            locCount[vId][cId] ||= {}
            if locCount[vId][cId][detId] == nil
              locCount[vId][cId][detId] = {}
              locCount[vId][cId][detId][:pri_fns] = []
              locCount[vId][cId][detId][:sec_fns] = []
              locCount[vId][cId][detId][:diff_fns] = []
              locCount[vId][cId][detId][:pri_loc_count] = 0
              locCount[vId][cId][detId][:sec_loc_count] = 0
              locCount[vId][cId][detId][:diff_loc_count] = 0
            end
            locCount[vId][cId][detId][:sec_fns] << fn
            locCount[vId][cId][detId][:sec_loc_count] += 1
          end

          # store difference between primary and secondary counts
          locCount.each do |vId, cIdCnt|
            cIdCnt.each do |cId, detCnt|
              detVal = locCount[vId][cId][detId]
              next if detVal == nil

              diffFns = (detVal[:pri_fns] - detVal[:sec_fns]).uniq
              diffLocCount = (detVal[:pri_loc_count] - detVal[:sec_loc_count]).abs
              locCount[vId][cId][detId][:diff_fns] = diffFns
              locCount[vId][cId][detId][:diff_loc_count] = diffLocCount
              # free up memory
              locCount[vId][cId][detId][:pri_fns] = nil
              locCount[vId][cId][detId][:sec_fns] = nil
            end
          end
        end

        clipIdLocCount = []
        # format:
        # [{video_id:, :clip_id, :loc_count, fn_count:, fn_visited_count:}, ]
        # sorted by :loc_count
        locCount.each do |vId, cIdCnt|
          cIdCnt.each do |cId, detCnt|
            diffFns = []
            diffLocCount = 0
            detCnt.each do |detId, detVal|
              diffFns += detVal[:diff_fns]
              diffLocCount += detVal[:diff_loc_count]
            end
            clipIdLocCount << {
              video_id: vId,
              clip_id: cId,
              loc_count: diffLocCount,
              fn_count: diffFns.uniq.count,
              fn_visited_count: 0
            }
          end
        end

        clipIdLocCount.sort_by{ |l| l[:loc_count] }.reverse
      end

    end
  end
end