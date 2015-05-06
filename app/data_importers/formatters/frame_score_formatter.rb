module DataImporters
	module Formatters
		class FrameScoreFormatter

			def initialize(detectableChiaIdMap, videoId, chiaVersionId)
				@detectableChiaIdMap = detectableChiaIdMap
				@videoId = videoId
				@chiaVersionId = chiaVersionId
			end

			def getFormatted(frameNumber, frameTime, scores)
				# Note: this is tied to schema in FrameScore class
				frameScore = {
					vi: @videoId,
					ci: @chiaVersionId,
					fn: frameNumber,
					ft: frameTime,
					scores: getFormattedPatchScores(scores)
				}
				return frameScore
			end

			def getFormattedPatchScores(scores)
				patchScoresHash = {}
				scores.each do |chiaClsId, chiaScrs|
					# mongo keys need to be strings
					detectableIdStr = @detectableChiaIdMap.getDetectableId(chiaClsId).to_s
					patchScoresHash[detectableIdStr] = {}
					patchScoresHash[detectableIdStr]["prob"] = chiaScrs["prob"].map{|x| x.to_f.round(2)}
					patchScoresHash[detectableIdStr]["fc8"] = chiaScrs["fc8"].map{|x| x.to_f.round(2)}
				end
				return patchScoresHash
			end

		end
	end
end
