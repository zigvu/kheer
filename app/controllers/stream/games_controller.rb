module Stream
  class GamesController < ApplicationController

    before_filter :ensure_html_format
    before_action :set_game, only: [:synch, :show, :edit, :update, :destroy]
    before_action :set_sub_season, only: [:synch, :new, :edit, :create, :update]

    # GET /games/1/synch
    def synch
      raise "Cellroti ID not found" if @sub_season.cellroti_id == nil
      success, message = CellrotiData::Game.synch(@game, {sub_season_id: @sub_season.cellroti_id})
      if success
        cellGtIds = @game.game_teams.pluck(:cellroti_id)
        # synch game_teams
        # first delete existing records that were deleted in kheer
        CellrotiData::GameTeam.where(game_id: @game.cellroti_id).each do |cellGt|
          cellGt.destroy if not cellGtIds.include?(cellGt.id)
        end
        # then create new game teams
        @game.game_teams.each do |gt|
          if gt.cellroti_id == nil
            cellrotiGameId = @game.cellroti_id
            cellrotiTeamId = gt.team.cellroti_id
            raise "Cellroti ID not found" if cellrotiGameId == nil or cellrotiTeamId == nil
            CellrotiData::GameTeam.synch(gt, {game_id: cellrotiGameId, team_id: cellrotiTeamId})
          end
        end

        redirect_to stream_sub_season_url(@sub_season), notice: 'Game : ' + message
      else
        redirect_to stream_sub_season_url(@sub_season), alert: 'Game : ' + message
      end
    end

    # GET /games/1
    def show
      @videos = @game.videos
    end

    # GET /games/new
    def new
      @game = ::Game.new
      2.times { @game.game_teams.build }
      @game.game_videos.build
    end

    # GET /games/1/edit
    def edit
      2.times { @game.game_teams.build }
      @game.game_videos.build
    end

    # POST /games
    def create
      @game = ::Game.new(game_params)

      if @game.save
        redirect_to stream_sub_season_url(@sub_season), notice: 'Game was successfully created.'
      else
        render action: 'new'
      end
    end

    # PATCH/PUT /games/1
    def update
      if @game.update(game_params)
        redirect_to stream_sub_season_url(@sub_season), notice: 'Game was successfully updated.'
      else
        render action: 'edit'
      end
    end

    # DELETE /games/1
    def destroy
      @game.destroy
      redirect_to stream_sports_url, notice: 'Game was successfully destroyed.'
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_game
        @game = ::Game.find(params[:id])
      end

      def set_sub_season
        if params[:sub_season_id] != nil
          @sub_season = ::SubSeason.find(params[:sub_season_id])
        elsif params[:game][:sub_season_id] != nil
          @sub_season = ::SubSeason.find(params[:game][:sub_season_id])
        else
          raise "SubSeason ID not available"
        end
      end

      # Only allow a trusted parameter "white list" through.
      def game_params
        params.require(:game).permit(:name, :description, :start_date, :venue_city, 
          :venue_stadium, :sub_season_id, 
          game_teams_attributes: [:id, :team_id, :_destroy],
          game_videos_attributes: [:id, :video_id, :_destroy])
      end
  end
end
