module Metrics
	module Analysis
		class ClipSetCreator

			def initialize(chiaVersionId, videoIds, detIdZdists)
				@chiaVersionId = chiaVersionId
				@clipIds = videoIds.map{ |vId| Video.find(vId).clips.pluck(:id) }.flatten
				@videoIds = videoIds
	      @zdistDetId = getZdistDetId(detIdZdists)

	      @clipSetSize = 5
	      @videoClipMap = DataImporters::VideoClipMap.new
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
				@zdistDetId.each do |zdist, detIds|
					cIdsVids = Localization.in(clip_id: @clipIds)
							.where(chia_version_id: @chiaVersionId)
							.in(detectable_id: detIds)
							.where(zdist_thresh: zdist)
							.pluck(:video_id, :clip_id, :frame_number)
					cIdsVids.each do |vId, cId, fn|
						locCount[vId] ||= {}
						if locCount[vId][cId] == nil
							locCount[vId][cId] = {}
							locCount[vId][cId][:loc_count] = 0
							locCount[vId][cId][:fns] = []
						end
						locCount[vId][cId][:loc_count] += 1
						locCount[vId][cId][:fns] << fn
					end
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

			# to minimze database access, group detIds with common
			# zdist values
			def getZdistDetId(detIdZdists)
				zdistDetId = {}
				detIdZdists.each do |detId, zdist|
					next if zdist == -1
					zdistDetId[zdist] ||= []
					zdistDetId[zdist] << detId.to_i
				end
				zdistDetId
			end

		end
	end
end