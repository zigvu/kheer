module Stream
  class SubSeasonsController < ApplicationController

    before_filter :ensure_html_format
    before_action :set_sub_season, only: [:show, :edit, :update, :destroy]
    before_action :set_season, only: [:new, :edit, :create, :update]

    # GET /sub_seasons/1
    def show
      @games = @sub_season.games
    end

    # GET /sub_seasons/new
    def new
      @sub_season = ::SubSeason.new
    end

    # GET /sub_seasons/1/edit
    def edit
    end

    # POST /sub_seasons
    def create
      @sub_season = ::SubSeason.new(sub_season_params)
      # @season = ::Season.find(params[:sub_season][:season_id])
      if @sub_season.save
        redirect_to stream_sub_season_url(@sub_season), notice: 'SubSeason was successfully created.'
      else
        render action: 'new'
      end
    end

    # PATCH/PUT /sub_seasons/1
    def update
      if @sub_season.update(sub_season_params)
        redirect_to stream_sub_season_url(@sub_season), notice: 'SubSeason was successfully updated.'
      else
        render action: 'edit'
      end
    end

    # DELETE /sub_seasons/1
    def destroy
      @sub_season.destroy
      redirect_to stream_sports_url, notice: 'Season was successfully destroyed.'
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_sub_season
        @sub_season = ::SubSeason.find(params[:id])
      end

      def set_season
        if params[:season_id] != nil
          @season = ::Season.find(params[:season_id])
        elsif params[:sub_season][:season_id] != nil
          @season = ::Season.find(params[:sub_season][:season_id])
        else
          raise "Season ID not available"
        end
      end

      # Only allow a trusted parameter "white list" through.
      def sub_season_params
        params.require(:sub_season).permit(:name, :description, :season_id)
      end
  end
end
