module Jsonifiers::Mining::Common
  class SetDetails

    def initialize(mining, setId)
      @mining = mining
      @clipSet = @mining.clip_sets[setId.to_s]

      @chiaVersionIdLoc = @mining.chia_version_id_loc
      @chiaVersionIdAnno = @mining.chia_version_id_anno

      if States::MiningType.new(mining).isZdistFinder?
        @selectedDetIds = @mining.md_zdist_finder.zdist_threshs.map{ |d, z| d.to_i if z != -1 }.uniq - [nil]
        @smartFilter = @mining.md_zdist_finder.smart_filter
      elsif States::MiningType.new(mining).isChiaVersionComparer?
        @selectedDetIds = @mining.md_chia_version_comparer.zdist_threshs_loc.map{ |d, z| d.to_i if z != -1 }.uniq - [nil]
        @smartFilter = @mining.md_chia_version_comparer.smart_filter
      elsif States::MiningType.new(mining).isZdistDifferencer?
        @selectedDetIds = @mining.md_zdist_differencer.zdist_threshs_pri.map{ |d, z| d.to_i if z != -1 }.uniq - [nil]
        @smartFilter = @mining.md_zdist_differencer.smart_filter
      end
    end

    def getChiaVersionFormatted(chiaVersionId)
    # <chiaVersion>: {
    #   id:, name:, settings: {zdistThresh: [zdistValue, ], scales: [scale, ]}
    # }
    cv = ::ChiaVersion.find(chiaVersionId)
    cvs = Serializers::ChiaVersionSettingsSerializer.new(cv)
    return {
      id: cv.id, name: cv.name, 
      settings: {zdistThresh: cvs.getSettingsZdistThresh, scales: cvs.getSettingsScales}
    }
    end

    def getDetectablesFormatted(chiaVersionId)
      # <detectables>: [{id:, name:, pretty_name:, chia_detectable_id:}, ]
      detectables = []
      ::ChiaVersionDetectable.where(chia_version_id: chiaVersionId).each do |cvd|
        det = cvd.detectable
        detectables << {
          id: det.id,
          name: det.name,
          pretty_name: det.pretty_name,
          chia_detectable_id: cvd.chia_detectable_id
        }
      end
      detectables
    end

    def getVideosFormatted(clipSet)
      # <video>: {
      #   video_id:, title:, playback_frame_rate:, 
      #   detection_frame_rate:
      # }
      videos = []
      clipSet.map{ |cls| cls["video_id"]}.uniq.each do |vId|
        video = ::Video.find(vId)
        videos << {
          video_id: video.id,
          title: video.title,
          playback_frame_rate: video.playback_frame_rate,
          detection_frame_rate: video.detection_frame_rate
        }
      end
      videos
    end

    def getClipsFormatted(clipSet)
      # <clip>: {clip_id:, clip_url:, clip_fn_start:, clip_fn_end:, length:}
      clips = []
      clipSet.map{ |cls| cls["clip_id"]}.uniq.each do |cId|
        clip = ::Clip.find(cId)
        clips << {
          clip_id: clip.id,
          clip_url: clip.clip_url,
          clip_fn_start: clip.frame_number_start,
          clip_fn_end: clip.frame_number_end,
          length: clip.length
        }
      end
      clips
    end

    def formatted
      # miningData: {
      #   chiaVersions: {localization: <chiaVersion>, annotation:<chiaVersion>},
      #   detectables: {localization: <detectables>, annotation:<detectables>},
      #   videos: [<video>, ],
      #   clips: [<clip>, ],
      #   clipSet: [{video_id:, clip_id:}],
      #   selectedDetIds: [int, ]
      #   smartFilter: {spatial_intersection_thresh:,}
      # }
      return {
        chiaVersions: {
          localization: getChiaVersionFormatted(@chiaVersionIdLoc),
          annotation:  getChiaVersionFormatted(@chiaVersionIdAnno)
        },
        detectables: {
          localization: getDetectablesFormatted(@chiaVersionIdLoc),
          annotation:  getDetectablesFormatted(@chiaVersionIdAnno)
        },
        videos: getVideosFormatted(@clipSet),
        clips: getClipsFormatted(@clipSet),
        clipSet: @clipSet,
        selectedDetIds: @selectedDetIds,
        smartFilter: @smartFilter,
      }
    end

  end
end