module Stream
  class ChannelsController < ApplicationController

    before_filter :ensure_html_format
    before_action :set_channel, only: [:show, :edit, :update, :destroy]

    # GET /channels
    def index
      @channels = ::Channel.all
    end

    # GET /channels/1
    def show
    end

    # GET /channels/new
    def new
      @channel = ::Channel.new
      @channel.channel_videos.build
      # @videos = ::Video.all
    end

    # GET /channels/1/edit
    def edit
      @channel.channel_videos.build
      # @videos = ::Video.all
    end

    # POST /channels
    def create
      @channel = ::Channel.new(channel_params)
      if @channel.save
        redirect_to stream_channels_url, notice: 'Channel was successfully created.'
      else
        render action: 'new'
      end
    end

    # PATCH/PUT /channels/1
    def update
      if @channel.update(channel_params)
        redirect_to stream_channels_url, notice: 'Channel was successfully updated.'
      else
        render action: 'edit'
      end
    end

    # DELETE /channels/1
    def destroy
      @channel.destroy
      redirect_to stream_channels_url
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_channel
        @channel = ::Channel.find(params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def channel_params
        params.require(:channel).permit(:name, :description, :url, :video_ids => [])
      end
  end
end