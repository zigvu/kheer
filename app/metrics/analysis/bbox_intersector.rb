module Metrics
	module Analysis
		class BboxIntersector

			def initialize
			end

			# areaIntersect(bbox1, bbox2)/ area(bbox2)
			def intersectArea(bbox1, bbox2)
				left = [bbox1.x, bbox2.x].max
				right = [(bbox1.x + bbox1.w), (bbox2.x + bbox2.w)].min
				top = [bbox1.y, bbox2.y].max
				bottom = [(bbox1.y + bbox1.h), (bbox2.y + bbox2.h)].min

				areaIntersect = 0
				if (left < right) and (top < bottom)
					areaIntersect = (right - left) * (bottom - top)
					areaIntersect = areaIntersect * 1.0 / (bbox2.w * bbox2.h)
				end
				areaIntersect
			end

		end
	end
end