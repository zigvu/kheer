module Stream
  class GamesController < ApplicationController

    before_filter :ensure_html_format
    before_action :set_game, only: [:show, :edit, :update, :destroy]
    before_action :set_sub_season, only: [:new, :edit, :create, :update]

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
        params.require(:game).permit(:name, :description, :start_date, :end_date, :venue_city, 
          :venue_stadium, :sub_season_id, 
          game_teams_attributes: [:id, :team_id, :_destroy],
          game_videos_attributes: [:id, :video_id, :_destroy])
      end
  end
end
