module Metrics
	module Analysis::Mining
		class ConfusionFinderIntersector

			def initialize
				@bboxIntersector = Metrics::Analysis::BboxIntersector.new
			end

			def computeIntersections(localizations)
				intersections = {}
				localizations.each do |loc2|
					intersections[loc2.id] = 0 if intersections[loc2.id] == nil
					localizations.each do |loc1|
						intersections[loc1.id] = 0 if intersections[loc1.id] == nil
						# don't compare to self - this would be 100%
						next if loc1.id == loc2.id

						# compute intersections
						intersectionVal = @bboxIntersector.intersectArea(loc1, loc2)
						# symmetrically add to both localizations
						intersections[loc1.id] += intersectionVal
						intersections[loc2.id] += intersectionVal
					end
				end
				intersections.each do |locId, interArea|
					interArea = 1.0 if interArea > 1.0
					intersections[locId] = interArea.round(1)
				end
				intersections
			end

		end
	end
end