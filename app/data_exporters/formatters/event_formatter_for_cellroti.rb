module DataExporters::Formatters
	class EventFormatterForCellroti

		def initialize
			@cellrotiEventIdMapper = {}
		end

		def getFormatted(frameAnnos)
			# Note: this is tied to JSON expectation of cellroti import handlers
			formatted = []
			frameAnnos.each do |fAnno|
				formatted << getCellEventId(fAnno.detectable_id)
			end
			formatted
		end

		def getCellEventId(detId)
			@cellrotiEventIdMapper[detId] ||= ::EventType.where(detectable_id: detId).first.cellroti_id
		end

	end
end
