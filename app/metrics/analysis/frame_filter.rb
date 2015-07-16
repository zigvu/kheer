module Metrics
	module Analysis
		class FrameFilter

			def initialize(chiaVersionId, videoIds, detectableIds, zdistThreshs)
				@chiaVersionId = chiaVersionId
				@videoIds = videoIds
				@detectableIds = detectableIds
				@zdistThreshs = zdistThreshs
			end

			def run
				viFnHash = {}
				viFns = ::Localization.where(chia_version_id: @chiaVersionId)
					.in(video_id: @videoIds)
					.in(detectable_id: @detectableIds)
					.in(zdist_thresh: @zdistThreshs)
					.pluck(:video_id, :frame_number)
				viFns.each do |vi, fn|
					if viFnHash[vi] == nil
						viFnHash[vi] = {}
						video = Video.find(vi)
						viFnHash[vi][:url] = video.source_url
						viFnHash[vi][:frames] = []
					end
					viFnHash[vi][:frames] << fn
				end
				viFnHash
			end

			def getClipIds(vi, fns)
				clipIds = []
				clipIdMap = Video.find(vi).clips.pluck(:id, :frame_number_start, :frame_number_end)
				fns.each do |fn|
					clipIdMap.each do |clpMap|
						clipIds << clpMap[0] if fn >= clpMap[1] and fn < clpMap[2]
					end
				end
				clipIds.sort.uniq
			end

		end
	end
end