module Metrics
	module Analysis::Mining
		class ZdistDifferencerIntersector

			def initialize
				@bboxIntersector = Metrics::Analysis::BboxIntersector.new
			end

			def computeIntersections(localizations, priZdist, secZdists, intThresh)
				# format {loclId: true/false, }
				intersections = {}
				localizations.each do |pri|
					# all localizations start out as having missing secondaries
					intersections[pri.id] = true if intersections[pri.id] == nil

					# if not included in filter, skip
					if (pri.zdist_thresh != priZdist)
						intersections[pri.id] = false
						next
					end

					localizations.each do |sec|
						# if already marked as to be included, skip
						next if intersections[sec.id]

						# don't compare to self - this would be 100%
						next if pri.id == sec.id
						# don't compare same zdist - these are not missing
						next if pri.zdist_thresh == sec.zdist_thresh

						# if not included in filter, skip
						next if not secZdists.include?(sec.zdist_thresh)

						# fraction of secondary that falls under primary
						interArea = @bboxIntersector.intersectArea(sec, pri)

						if interArea >= intThresh
							intersections[pri.id] = false
						end
					end # sec
				end # pri
				intersections
			end

		end
	end
end