module Retraining
  class IterationsController < ApplicationController
    before_action :set_iteration, only: [:show, :edit, :update, :destroy]

    # GET /iterations
    def index
      @iterations = ::Iteration.all
    end

    # GET /iterations/1
    def show
      iState = States::IterationState.new(@iteration)
      isNewIteration = iState.isNew?
      session[:iteration_id] = nil if isNewIteration

      @isExportCompleted = iState.isExportCompleted?
      if @isExportCompleted
        @summaryCounts = @iteration.summary_counts
        @summaryConsidered = @iteration.summary_considered
      end
    end

    # GET /iterations/new
    def new
      @iteration = ::Iteration.new

      @possibleChiaVersions = ::ChiaVersion.all
      iState = States::IterationState.new(@iteration)
      parentStates = [iState.exportCompleted]
      @possibleParents = ::Iteration.in(state: parentStates)
    end

    # GET /iterations/1/edit
    def edit
      @possibleChiaVersions = ::ChiaVersion.all
      iState = States::IterationState.new(@iteration)
      parentStates = [iState.exportCompleted]
      @possibleParents = ::Iteration.in(state: parentStates)
    end

    # POST /iterations
    def create
      @iteration = ::Iteration.new(iteration_params)
      @iteration.user_id = current_user.id

      # assign minor chia version
      minorChiaVersion = 1
      parentIteration = @iteration.parent
      if parentIteration != nil
        if parentIteration.major_chia_version_id == @iteration.major_chia_version_id
          minorChiaVersion = parentIteration.minor_chia_version_id + 1
        end
      end
      @iteration.minor_chia_version_id = minorChiaVersion

      if @iteration.save
        States::IterationState.new(@iteration).setNew
        redirect_to retraining_iteration_url(@iteration), notice: 'Iteration was successfully created.'
      else
        render action: 'new'
      end
    end

    # PATCH/PUT /iterations/1
    def update
      if @iteration.update(iteration_params)
        redirect_to retraining_iteration_url(@iteration), notice: 'Iteration was successfully updated.'
      else
        render action: 'edit'
      end
    end

    # DELETE /iterations/1
    def destroy
      # update so that parent is not dangling
      ::Iteration.where(parent_iteration: @iteration.id).each do |i|
        i.update(parent_iteration: nil)
      end

      @iteration.destroy
      redirect_to retraining_iterations_url
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_iteration
        @iteration = ::Iteration.find(params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def iteration_params
        params.require(:iteration).permit(:name, :major_chia_version_id, :parent_iteration)
      end
  end
end
