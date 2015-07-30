module Analysis::MiningSetup
  class ChiaVersionComparerController < ApplicationController
    include Wicked::Wizard
    before_action :set_steps
    before_action :setup_wizard

    before_action :set_steps_ll, only: [:show, :update]

    def show
      case step
      when :chia_version
        serveChiaVersion
      when :videos
        serveVideos
      when :zdist_threshs_loc
        serveZDistThreshsLoc
      when :zdist_threshs_sec
        serveZDistThreshsSec
      when :smart_filters
        serveSmartFilters
      when :create_sets
        serveCreateSets
      end
      render_wizard
    end

    def update
      case step
      when :chia_version
        handleChiaVersion
      when :videos
        handleVideos
      when :zdist_threshs_loc
        handleZDistThreshsLoc
      when :zdist_threshs_sec
        handleZDistThreshsSec
      when :smart_filters
        handleSmartFilters
      when :create_sets
        handleCreateSets
      end
      # for some reason `finish_wizard_path` below not working
      if step == steps.last
        redirect_to analysis_mining_path(@mining)
      else
        render_wizard @mining
      end
    end

    def finish_wizard_path
      analysis_mining_path(@mining)
    end


    private
      def serveChiaVersion
        @chiaVersionIdLoc = @mining.chia_version_id_loc
        @chiaVersionIdSec = @mining.md_chia_version_comparer.chia_version_id_sec
        @chiaVersionIdAnno = @mining.chia_version_id_anno
        @chiaVersions = ::ChiaVersion.all
      end
      def handleChiaVersion
        chiaVersionIdLoc = params[:chia_version_id_loc].to_i
        chiaVersionIdSec = params[:chia_version_id_sec].to_i
        chiaVersionIdAnno = params[:chia_version_id_anno].to_i
        @mining.update(
          chia_version_id_loc: chiaVersionIdLoc,
          chia_version_id_anno: chiaVersionIdAnno
        )
        @mining.md_chia_version_comparer.update(
          chia_version_id_sec: chiaVersionIdSec
        )
      end

      def serveVideos
        @chiaVersionIdLoc = @mining.chia_version_id_loc
        @chiaVersionIdSec = @mining.md_chia_version_comparer.chia_version_id_sec
        @videoIds = @mining.video_ids || []

        kjVIdsLoc = KheerJob.where(state: States::KheerJobState.new(nil).successProcess)
            .where(chia_version_id: @chiaVersionIdLoc).pluck(:video_id)
        kjVIdsSec = KheerJob.where(state: States::KheerJobState.new(nil).successProcess)
            .where(chia_version_id: @chiaVersionIdSec).pluck(:video_id)
        # intersection
        kjVIds = kjVIdsLoc & kjVIdsSec
        @videos = ::Video.where(id: kjVIds)
      end
      def handleVideos
        videoIds = params[:video_ids].map{ |v| v.to_i }
        @mining.update(video_ids: videoIds)
      end

      def serveZDistThreshsLoc
        chiaVersionIdLoc = @mining.chia_version_id_loc
        videoIds = @mining.video_ids
        @zdistThreshs = @mining.md_chia_version_comparer.zdist_threshs_loc || {}

        @metricsVideo = ::Metrics::Analysis::VideosDetails.new(chiaVersionIdLoc, videoIds)
        @metricsVideoDetails = @metricsVideo.getSummaryCounts
      end
      def handleZDistThreshsLoc
        chiaVersionIdLoc = @mining.chia_version_id_loc
        videoIds = @mining.video_ids

        zd = params[:det_ids].map{ |d,z| [d.to_i, z.to_f] if z.to_f > -1 } - [nil]
        zdistThreshs = Hash[zd]
        @mining.md_chia_version_comparer.update(zdist_threshs_loc: zdistThreshs)
      end

      def serveZDistThreshsSec
        chiaVersionIdSec = @mining.md_chia_version_comparer.chia_version_id_sec
        videoIds = @mining.video_ids
        @zdistThreshsLoc = @mining.md_chia_version_comparer.zdist_threshs_loc
        @zdistThreshs = @mining.md_chia_version_comparer.zdist_threshs_sec || {}

        @metricsVideo = ::Metrics::Analysis::VideosDetails.new(chiaVersionIdSec, videoIds)
        @metricsVideoDetails = @metricsVideo.getSummaryCounts
      end
      def handleZDistThreshsSec
        zd = params[:det_ids].map{ |d,z| [d.to_i, z.to_f] if z.to_f > -1 } - [nil]
        zdistThreshs = Hash[zd]
        @mining.md_chia_version_comparer.update(zdist_threshs_sec: zdistThreshs)

        clipSets = ::Metrics::Analysis::Mining::ChiaVersionComparerClipSet.new(@mining).getClipSets
        @mining.update(clip_sets: clipSets)
      end

      def serveSmartFilters
      end
      def handleSmartFilters
        spatialIntersectionThresh = params[:spatial_intersection_thresh].to_f
        @mining.md_chia_version_comparer.update(smart_filter: {spatial_intersection_thresh: spatialIntersectionThresh})
      end

      def serveCreateSets
        @clipSets = @mining.clip_sets
      end
      def handleCreateSets
        session[:mining_id] = nil
        States::MiningState.new(@mining).setCompleteSetup
      end

      # Use callbacks to share common setup or constraints between actions.
      def set_steps
        session[:mining_id] ||= params[:mining_id]
        @mining = ::Mining.find(session[:mining_id])
        self.steps = [:chia_version, :videos, :zdist_threshs_loc, :zdist_threshs_sec, :smart_filters, :create_sets]
      end

      def set_steps_ll
        @current_step = step
        @prev_step = steps.index(step) == 0 ? nil : steps[steps.index(step) - 1]
        @next_step = steps.index(step) == (steps.count - 1) ? nil : steps[steps.index(step) + 1]
      end
  end
end
