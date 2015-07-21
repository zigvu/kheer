module Metrics
	module Analysis
		class LocalizationIntersector

			def initialize
			end

			# areaIntersect(loc1, loc2)/ area(loc2)
			def intersectValue(loc1, loc2)
				left = [loc1.x, loc2.x].max
				right = [(loc1.x + loc1.w), (loc2.x + loc2.w)].min
				top = [loc1.y, loc2.y].max
				bottom = [(loc1.y + loc1.h), (loc2.y + loc2.h)].min

				areaIntersect = 0
				if (left < right) and (top < bottom)
					areaIntersect = (right - left) * (bottom - top)
					areaIntersect = areaIntersect * 1.0 / (loc2.w * loc2.h)
				end
				areaIntersect
			end

			def computeIntersections(localizations)
				intersections = {}
				localizations.each do |loc2|
					intersections[loc2.id] = 0
					localizations.each do |loc1|
						next if loc1.id == loc2.id
						intersections[loc2.id] += intersectValue(loc1, loc2)
					end
				end
				intersections
			end

		end
	end
end