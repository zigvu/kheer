module Analysis::MiningSetup
  class SequenceViewerController < ApplicationController
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
        @chiaVersionIdAnno = @mining.chia_version_id_anno
        @chiaVersions = ::ChiaVersion.all
      end
      def handleChiaVersion
        chiaVersionIdLoc = params[:chia_version_id_loc].to_i
        chiaVersionIdAnno = params[:chia_version_id_anno].to_i
        @mining.update(
          chia_version_id_loc: chiaVersionIdLoc,
          chia_version_id_anno: chiaVersionIdAnno
        )
      end

      def serveVideos
        @videoIds = @mining.video_ids || []
        @videos = ::Video.all
      end
      def handleVideos
        videoIds = params[:video_ids].map{ |v| v.to_i }
        @mining.update(video_ids: videoIds)

        clipSets = ::Metrics::Analysis::Mining::SequenceViewerClipSet.new(@mining).getClipSets
        @mining.update(clip_sets: clipSets)
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
        self.steps = [:chia_version, :videos, :create_sets]
      end

      def set_steps_ll
        @current_step = step
        @prev_step = steps.index(step) == 0 ? nil : steps[steps.index(step) - 1]
        @next_step = steps.index(step) == (steps.count - 1) ? nil : steps[steps.index(step) + 1]
      end
  end
end
