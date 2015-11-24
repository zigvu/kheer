module Metrics
  module Export
    class BboxCombiner

      def initialize
      end

      def combine(frameLocs)
        # format
        # {detId: [{x:, y:, width:, height:, score:}, ] }
        mergedBoxes = {}

        # loop through all locs
        frameLocs.each do |loc|
          # initially the loc is unmerged
          umbox = locToBox(loc)
          detId = loc.detectable_id

          # initialize to empty list
          mergedBoxes[detId] ||= []

          # mark all boxes that intersects with new box
          markedBoxes = []
          mergedBoxes[detId].each do |mbox|
            markedBoxes << mbox if intersects?(umbox, mbox)
          end

          # if marked boxes exist, combine them
          if markedBoxes.count > 0
            # include current box and merge all
            markedBoxes << umbox
            newMbox = mergeBox(markedBoxes)

            # remove boxes that have been merged
            markedBoxes.each do |mbox|
              mergedBoxes[detId].delete(mbox)
            end

            # add newly merged box
            mergedBoxes[detId] << newMbox
          else
            # if cannot be merged with any existing box, add to list
            mergedBoxes[detId] += [umbox]
          end # end if markedBoxes

        end # end frameLocs

        # done with combining all boxes
        mergedBoxes
      end

      def locToBox(loc)
        # format:
        # {x:, y:, width:, height:, score:}
        return { x: loc.x, y: loc.y, width: loc.w, height: loc.h, score: loc.prob_score }
      end

      def mergeBox(markedBoxes)
        newMbox = {}
        newMbox[:x] = markedBoxes.map{ |b| b[:x] }.min
        newMbox[:y] = markedBoxes.map{ |b| b[:y] }.min
        newMbox[:width] = markedBoxes.map{ |b| b[:x] + b[:width] }.max - newMbox[:x]
        newMbox[:height] = markedBoxes.map{ |b| b[:y] + b[:height] }.max - newMbox[:y]
        newMbox[:score] = markedBoxes.map{ |b| b[:score] }.max

        newMbox
      end

      def intersects?(abox, bbox)
        aX0 = abox[:x]
        aY0 = abox[:y]
        aX2 = abox[:x] + abox[:width]
        aY2 = abox[:y] + abox[:height]
        aScore = abox[:score]

        bX0 = bbox[:x]
        bY0 = bbox[:y]
        bX2 = bbox[:x] + bbox[:width]
        bY2 = bbox[:y] + bbox[:height]
        bScore = bbox[:score]

        return ((aX0 < bX2) and (aX2 > bX0) and (aY0 < bY2) and (aY2 > bY0))
      end

    end
  end
end
