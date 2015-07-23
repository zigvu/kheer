module Metrics
	module Analysis::Mining
		class ZdistFinderIntersector

			def initialize
				@bboxIntersector = Metrics::Analysis::BboxIntersector.new
			end

			def computeIntersections(localizations)
				intersections = {}
				localizations.each do |loc2|
					intersections[loc2.id] = 0
					localizations.each do |loc1|
						# don't compare to self - this would be 100%
						next if loc1.id == loc2.id
						# skip same detectable localization
						next if loc1.detectable_id == loc2.detectable_id
						intersections[loc2.id] += @bboxIntersector.intersectArea(loc1, loc2)
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