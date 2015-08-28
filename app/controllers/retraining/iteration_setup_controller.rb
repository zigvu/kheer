module Retraining
  class IterationSetupController < ApplicationController
    include Wicked::Wizard
    before_action :set_steps
    before_action :setup_wizard

    before_action :set_steps_ll, only: [:show, :update]

    def show
      case step
      when :chia_version
        serveChiaVersion
      when :import_scores
        serveImportScores
      when :select_patches
        serveSelectPatches
      when :confirm_selections
        serveConfirmSelections
      when :export_selections
        serveExportSelections
      end
      render_wizard
    end

    def update
      case step
      when :chia_version
        handleChiaVersion
      when :import_scores
        handleImportScores
      when :select_patches
        handleSelectPatches
      when :confirm_selections
        handleConfirmSelections
      when :export_selections
        handleExportSelections
      end
      # for some reason `finish_wizard_path` below not working
      if step == steps.last
        redirect_to retraining_iteration_path(@iteration)
      else
        render_wizard @iteration
      end
    end

    def finish_wizard_path
      retraining_iteration_path(@iteration)
    end


    private
      def serveChiaVersion
        @annotationChiaVersionIds = @iteration.annotation_chia_version_ids || []
        majorChiaVersion = @iteration.major_chia_version
        @chiaVersions = ::ChiaVersion.where(ctype: majorChiaVersion.ctype).to_a - [majorChiaVersion]
      end
      def handleChiaVersion
        chiaVersionIds = params[:chia_version_ids].map{ |c| c.to_i }
        @iteration.update(annotation_chia_version_ids: chiaVersionIds)
     end

      def serveImportScores
        annotationChiaVersionIds = @iteration.annotation_chia_version_ids
        @chiaVersions = ::ChiaVersion.where(id: annotationChiaVersionIds)
      end
      def handleImportScores
      end

      def serveSelectPatches
        @summaryCounts = @iteration.summary_counts
      end
      def handleSelectPatches
        numPatches = params["numberOfPatches"].to_i
        sc = Metrics::Retraining::RoundRobiner.new(@iteration).roundRobinAll(numPatches)
        @iteration.update(summary_considered: sc)
      end

      def serveConfirmSelections
        @summaryCounts = @iteration.summary_counts
        @summaryConsidered = @iteration.summary_considered
      end
      def handleConfirmSelections
      end

      def serveExportSelections
      end
      def handleExportSelections
        @iteration.patch_buckets.destroy_all
        States::IterationState.new(@iteration).setExportComplete
      end

      # Use callbacks to share common setup or constraints between actions.
      def set_steps
        session[:iteration_id] ||= params[:iteration_id]
        @iteration = ::Iteration.find(session[:iteration_id])
        @cState = States::IterationState.new(@iteration)
        
        self.steps = [:chia_version, :import_scores, :select_patches,
          :confirm_selections, :export_selections]
      end

      def set_steps_ll
        @current_step = step
        @prev_step = steps.index(step) == 0 ? nil : steps[steps.index(step) - 1]
        @next_step = steps.index(step) == (steps.count - 1) ? nil : steps[steps.index(step) + 1]
      end
  end
end
