module Analysis::MiningSetup
  class DetFinderController < ApplicationController
    include Wicked::Wizard
    before_action :set_steps
    before_action :setup_wizard

    before_action :set_steps_ll, only: [:show, :update]

    def show
      case step
      when :chia_version
        serveChiaVersion
      when :detectables
        serveDetectables
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
      when :detectables
        handleDetectables
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

      def serveDetectables
        @detectableIds = @mining.md_det_finder.detectable_ids || []

        @priZdist = @mining.md_det_finder.pri_zdist
        @secZdist = @mining.md_det_finder.sec_zdist

        chiaVersion = ::ChiaVersion.find(@mining.chia_version_id_loc)

        allDetectableIds = chiaVersion.chia_version_detectables.pluck(:detectable_id)
        @allDetectables = ::Detectable.where(id: allDetectableIds)

        cvs = Serializers::ChiaVersionSettingsSerializer.new(chiaVersion)
        @zdistThreshs = cvs.getSettingsZdistThresh
      end
      def handleDetectables
        detectableIds = params[:detectable_ids].map{ |d| d.to_i }

        @mining.md_det_finder.update(detectable_ids: detectableIds)

        priZdist = params[:pri_zdist].to_f
        @mining.md_det_finder.update(pri_zdist: priZdist)

        secZdist = params[:sec_zdist].to_f
        @mining.md_det_finder.update(sec_zdist: secZdist)
      end

      def serveVideos
        chiaVersionIdLoc = @mining.chia_version_id_loc

        @videoIds = @mining.video_ids || []

        kjVIds = KheerJob.where(state: States::KheerJobState.new(nil).successProcess)
            .where(chia_version_id: chiaVersionIdLoc)
            .pluck(:video_id)
        @videos = ::Video.where(id: kjVIds)
      end
      def handleVideos
        videoIds = params[:video_ids].map{ |v| v.to_i }
        @mining.update(video_ids: videoIds)

        clipSets = ::Metrics::Analysis::Mining::DetFinderClipSet.new(@mining).getClipSets
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
        self.steps = [:chia_version, :detectables, :videos, :create_sets]
      end

      def set_steps_ll
        @current_step = step
        @prev_step = steps.index(step) == 0 ? nil : steps[steps.index(step) - 1]
        @next_step = steps.index(step) == (steps.count - 1) ? nil : steps[steps.index(step) + 1]
      end
  end
end
