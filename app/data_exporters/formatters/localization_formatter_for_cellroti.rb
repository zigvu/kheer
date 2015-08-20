module DataExporters::Formatters
	class LocalizationFormatterForCellroti

		def initialize
			@cellrotiDetIdMapper = {}
		end

		def getFormatted(frameLocs)
			# Note: this is tied to JSON expectation of cellroti import handlers
			formatted = {}
			frameLocs.each do |fLoc|
				cellDetId = getCellDetId(fLoc.detectable_id)
				formatted[cellDetId] ||= []
				formatted[cellDetId] << {
					bbox: { x: fLoc.x, y: fLoc.y, width: fLoc.w, height: fLoc.h },
					score: fLoc.prob_score
				}
			end
			formatted
		end

		def getCellDetId(detId)
			@cellrotiDetIdMapper[detId] ||= ::Detectable.find(detId).cellroti_id
		end

		def getCellDetIds(allDetIds)
			::Detectable.where(id: allDetIds).pluck(:id, :cellroti_id).each do |detId, cellrotiId|
				@cellrotiDetIdMapper[detId] = cellrotiId
			end
			@cellrotiDetIdMapper.values
		end

	end
end
