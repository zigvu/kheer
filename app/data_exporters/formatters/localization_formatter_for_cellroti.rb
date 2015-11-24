module DataExporters::Formatters
	class LocalizationFormatterForCellroti

		def initialize
			@cellrotiDetIdMapper = {}
		end

		def getFormatted(combinedBboxes)
			# Note: this is tied to JSON expectation of cellroti import handlers
			formatted = {}
			combinedBboxes.each do |detId, bboxes|
				cellDetId = getCellDetId(detId)
				formatted[cellDetId] ||= []

				bboxes.each do |bbox|
					formatted[cellDetId] << {
						bbox: bbox.except(:score),
						score: bbox[:score]
					}
				end
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
