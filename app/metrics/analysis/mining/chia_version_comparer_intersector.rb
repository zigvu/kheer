module Metrics
	module Analysis::Mining
		class ChiaVersionComparerIntersector

			def initialize
				@bboxIntersector = Metrics::Analysis::BboxIntersector.new
			end

			def computeIntersections(locCvPri, locCvSec)
				intersections = {}
				locCvPri.each do |loc1|
					intersections[loc1.id] = 0
					locCvSec.each do |loc2|
						# consider bboxes of same localization only
						next if loc1.detectable_id != loc2.detectable_id
						intersections[loc1.id] += @bboxIntersector.intersectArea(loc1, loc2)
					end
				end
				locCvSec.each do |loc1|
					intersections[loc1.id] = 0
					locCvPri.each do |loc2|
						# consider bboxes of same localization only
						next if loc1.detectable_id != loc2.detectable_id
						intersections[loc1.id] += @bboxIntersector.intersectArea(loc1, loc2)
					end
				end
				intersections.each do |locId, interArea|
					intersections[locId] = interArea.round(3)
				end
				intersections
			end

		end
	end
end