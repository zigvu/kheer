module Metrics
	module Analysis::Mining
		class ConfusionFinderIntersector

			def initialize
				@bboxIntersector = Metrics::Analysis::BboxIntersector.new
			end

			def computeIntersections(localizations, intThreshs)
				intersections = {}
				localizations.each do |pri|
					intersections[pri.id] = false if intersections[pri.id] == nil
					localizations.each do |sec|
						intersections[sec.id] = false if intersections[sec.id] == nil
						# don't compare to self - this would be 100%
						next if pri.id == sec.id
						interArea = @bboxIntersector.intersectArea(pri, sec)
						interArea = 1 if interArea > 1
						intThresh = interArea.round(1)
						if intThreshs.include?(intThresh)
							intersections[pri.id] = true
							intersections[sec.id] = true
						end
					end
				end
				intersections
			end

		end
	end
end