module Analysis
  class MetricsController < ApplicationController

    # GET /metrics/video_details
    def video_details
      @chiaVersionId = params['chia_version_id'].to_i
      @videoId = params['video_id'].to_i

      @metricsVideo = ::Metrics::Analysis::VideosDetails.new(@chiaVersionId, [@videoId])
      @metricsVideoDetails = @metricsVideo.getDetails
    end
  end
end
