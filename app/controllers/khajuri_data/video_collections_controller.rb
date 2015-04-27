module KhajuriData
  class VideoCollectionsController < ApplicationController
    before_action :set_video_collection, only: [:show, :edit, :update, :destroy]

    # GET /video_collections
    # GET /video_collections.json
    def index
      @video_collections = ::VideoCollection.all
    end

    # GET /video_collections/1
    # GET /video_collections/1.json
    def show
    end

    # GET /video_collections/new
    def new
      @video_collection = ::VideoCollection.new
    end

    # GET /video_collections/1/edit
    def edit
    end

    # POST /video_collections
    # POST /video_collections.json
    def create
      @video_collection = ::VideoCollection.new(video_collection_params)

      respond_to do |format|
        if @video_collection.save
          format.html { redirect_to khajuri_data_video_collection_url(@video_collection), notice: 'Video collection was successfully created.' }
          format.json { render action: 'show', status: :created, location: @video_collection }
        else
          format.html { render action: 'new' }
          format.json { render json: @video_collection.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /video_collections/1
    # PATCH/PUT /video_collections/1.json
    def update
      respond_to do |format|
        if @video_collection.update(video_collection_params)
          format.html { redirect_to khajuri_data_video_collection_url(@video_collection), notice: 'Video collection was successfully updated.' }
          format.json { head :no_content }
        else
          format.html { render action: 'edit' }
          format.json { render json: @video_collection.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /video_collections/1
    # DELETE /video_collections/1.json
    def destroy
      @video_collection.destroy
      respond_to do |format|
        format.html { redirect_to khajuri_data_video_collections_url }
        format.json { head :no_content }
      end
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_video_collection
        @video_collection = ::VideoCollection.find(params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def video_collection_params
        params.require(:video_collection).permit(:title, :description, :comment, :source_type, :source_url, :quality, :format, :playback_frame_rate, :detection_frame_rate, :width, :height)
      end
  end
end