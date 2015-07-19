module Metrics
	module Analysis
		class ZdistValuesConsolidator

			attr_accessor :zdistDetId

			def initialize(detIdZdists)
	      @zdistDetId = getZdistDetId(detIdZdists)
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