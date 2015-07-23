module Jsonifiers::Mining::ZdistFinder
  class FullAnnotations

    def initialize(mining, setId)
      @mining = mining
      clipSet = @mining.clip_sets[setId.to_s]
      @clipIds = clipSet.map{ |cs| cs["clip_id"].to_i }
      @chiaVersionId = @mining.chia_version_id_anno
    end

    def generateQueries
      queries = []
      # get all annotations for clips in set
      queries << ::Annotation.where(active: true).in(clip_id: @clipIds)
      queries
   end

    def formatted
      # dataFullAnnotations: {:video_id => {:video_fn => {:detectable_id => [anno]}}}
      #   where anno: {chia_version_id:, x0:, y0:, x1:, y1:, x2:, y2:, x3:, y3}

      anno = {}
      queries = generateQueries()
      queries.each do |q|
        entries = q.pluck(
          :video_id, :frame_number, :detectable_id, :chia_version_id,
          :x0, :y0, :x1, :y1, :x2, :y2, :x3, :y3)
        entries.each do |e|
          video_id = e[0]
          frame_number = e[1]
          detectable_id = e[2]
          chia_version_id = e[3]
          x0 = e[4]
          y0 = e[5]
          x1 = e[6]
          y1 = e[7]
          x2 = e[8]
          y2 = e[9]
          x3 = e[10]
          y3 = e[11]

          anno[video_id] = {} if anno[video_id] == nil
          anno[video_id][frame_number] = {} if anno[video_id][frame_number] == nil
          anno[video_id][frame_number][detectable_id] = [] if anno[video_id][frame_number][detectable_id] == nil

          anno[video_id][frame_number][detectable_id] << {
            chia_version_id: chia_version_id, 
            x0: x0, y0: y0, x1: x1, y1: y1, x2: x2, y2: y2, x3: x3, y3: y3
          }
        end
      end
      anno
    end

  end
end