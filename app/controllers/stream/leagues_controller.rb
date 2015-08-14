module Stream
  class LeaguesController < ApplicationController

    before_filter :ensure_html_format
    before_action :set_league, only: [:synch, :show, :edit, :update, :destroy]
    before_action :set_sport, only: [:synch, :new, :edit, :create, :update]

    # GET /leagues/1/synch
    def synch
      raise "Cellroti ID not found" if @sport.cellroti_id == nil
      CellrotiData::League.synch(@league, {sport_id: @sport.cellroti_id})
      redirect_to stream_sport_url(@sport), notice: 'League was successfully synched.'
    end

    # GET /leagues/1
    def show
      @seasons = @league.seasons
      @teams = @league.teams
    end

    # GET /leagues/new
    def new
      @league = ::League.new
    end

    # GET /leagues/1/edit
    def edit
    end

    # POST /leagues
    def create
      @league = ::League.new(league_params)
      if @league.save
        redirect_to stream_sport_url(@sport), notice: 'League was successfully created.'
      else
        render action: 'new'
      end
    end

    # PATCH/PUT /leagues/1
    def update
      if @league.update(league_params)
        redirect_to stream_sport_url(@sport), notice: 'League was successfully updated.'
      else
        render action: 'edit'
      end
    end

    # DELETE /leagues/1
    def destroy
      @league.destroy
      redirect_to stream_sports_url, notice: 'League was successfully destroyed.'
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_league
        @league = ::League.find(params[:id])
      end

      def set_sport
        if params[:sport_id] != nil
          @sport = ::Sport.find(params[:sport_id])
        elsif params[:league][:sport_id] != nil
          @sport = ::Sport.find(params[:league][:sport_id])
        else
          raise "Sports ID not available"
        end
      end

      # Only allow a trusted parameter "white list" through.
      def league_params
        params.require(:league).permit(:name, :description, :sport_id)
      end
  end
end
