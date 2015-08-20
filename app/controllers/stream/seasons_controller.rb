module Stream
  class SeasonsController < ApplicationController

    before_filter :ensure_html_format
    before_action :set_season, only: [:synch, :show, :edit, :update, :destroy]
    before_action :set_league, only: [:synch, :new, :edit, :create, :update]

    # GET /seasons/1/synch
    def synch
      raise "Cellroti ID not found" if @league.cellroti_id == nil
      success, message = CellrotiData::Season.synch(
        @season, {league_id: @league.cellroti_id})
      if success
        redirect_to stream_league_url(@league), notice: 'Season : ' + message
      else
        redirect_to stream_league_url(@league), alert: 'Season : ' + message
      end
    end

    # GET /seasons/1
    def show
      @sub_seasons = @season.sub_seasons
    end

    # GET /seasons/new
    def new
      @season = ::Season.new
    end

    # GET /seasons/1/edit
    def edit
    end

    # POST /seasons
    def create
      @season = ::Season.new(season_params)
      if @season.save
        redirect_to stream_league_url(@league), notice: 'Season was successfully created.'
      else
        render action: 'new'
      end
    end

    # PATCH/PUT /seasons/1
    def update
      if @season.update(season_params)
        redirect_to stream_league_url(@league), notice: 'Season was successfully updated.'
      else
        render action: 'edit'
      end
    end

    # DELETE /seasons/1
    def destroy
      @season.destroy
      redirect_to stream_sports_url, notice: 'Season was successfully destroyed.'
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_season
        @season = ::Season.find(params[:id])
      end

      def set_league
        if params[:league_id] != nil
          @league = ::League.find(params[:league_id])
        elsif params[:season][:league_id] != nil
          @league = ::League.find(params[:season][:league_id])
        else
          raise "League ID not available"
        end
      end

      # Only allow a trusted parameter "white list" through.
      def season_params
        params.require(:season).permit(:name, :description, :league_id)
      end
  end
end
