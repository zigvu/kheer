module Analysis
  class MiningsController < ApplicationController
    before_action :set_mining, only: [:mine, :progress, :show, :edit, :update, :destroy]
    before_action :set_setId, only: [:mine, :progress]

    # GET /minings/:id/mine/:set_id
    def mine
      @miningId = @mining.id
    end

    def progress
      done = params['done'] == "true"

      clipSetsProgress = @mining.clip_sets_progress
      clipSetsProgress[@setId.to_s] = done
      @mining.update(clip_sets_progress: clipSetsProgress)
      redirect_to analysis_mining_url(@mining), notice: "Set #{@setId}: done marked as #{done}."
    end

    # GET /minings
    def index
      @minings = ::Mining.all
    end

    # GET /minings/1
    def show
      @isNewSession = States::MiningState.new(@mining).isNew?
      if @isNewSession
        session[:mining_id] = nil
      else
        @clipSets = @mining.clip_sets
        @clipSetsProgress = @mining.clip_sets_progress
      end
    end

    # GET /minings/new
    def new
      @mining = ::Mining.new
    end

    # GET /minings/1/edit
    def edit
    end

    # POST /minings
    def create
      @mining = ::Mining.new(mining_params)
      @mining.user_id = current_user.id
      @mining.clip_sets_progress = {}
      if @mining.save
        States::MiningState.new(@mining).setNew
        redirect_to analysis_mining_url(@mining), notice: 'Mine was successfully created.'
      else
        render action: 'new'
      end
    end

    # PATCH/PUT /minings/1
    def update
      if @mining.update(mining_params)
        redirect_to analysis_mining_url(@mining), notice: 'Mine was successfully updated.'
      else
        render action: 'edit'
      end
    end

    # DELETE /minings/1
    def destroy
      @mining.destroy
      redirect_to analysis_minings_url
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_mining
        @mining = ::Mining.find(params[:id])
      end

      def set_setId
        @setId = params['set_id'].to_i
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def mining_params
        params.require(:mining).permit(:name, :description, :mtype)
      end
  end
end
