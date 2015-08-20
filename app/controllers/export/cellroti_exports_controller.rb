module Export
  class CellrotiExportsController < ApplicationController
    before_action :set_cellroti_export, only: [:show, :edit, :update, :destroy]

    # GET /cellroti_exports
    def index
      @cellroti_exports = ::CellrotiExport.all
    end

    # GET /cellroti_exports/1
    def show
      @cState = States::CellrotiExportState.new(@cellroti_export)
      session[:cellroti_export_id] = nil if @cState.isNew?

      @isSessionComplete = @cState.isComplete?
      @isSetupComplete = @cState.isCompleteSetup? || @cState.isAfterCompleteSetup?
      if @isSessionComplete || @isSetupComplete
        @chiaVersionLoc = ::ChiaVersion.find(@cellroti_export.chia_version_id_loc)
        @chiaVersionEvent = ::ChiaVersion.find(@cellroti_export.chia_version_id_event)
        @videos = ::Video.where(id: @cellroti_export.video_ids)
        @eventDetectables = ::Detectable.where(id: @cellroti_export.event_detectable_ids)
      end
    end

    # GET /cellroti_exports/new
    def new
      @cellroti_export = ::CellrotiExport.new
    end

    # GET /cellroti_exports/1/edit
    def edit
    end

    # POST /cellroti_exports
    def create
      @cellroti_export = ::CellrotiExport.new(cellroti_export_params)
      @cellroti_export.user_id = current_user.id
      if @cellroti_export.save
        States::CellrotiExportState.new(@cellroti_export).setNew
        redirect_to export_cellroti_export_url(@cellroti_export), notice: 'Cellroti export was successfully created.'
      else
        render action: 'new'
      end
    end

    # PATCH/PUT /cellroti_exports/1
    def update
      if @cellroti_export.update(cellroti_export_params)
        redirect_to export_cellroti_export_url(@cellroti_export), notice: 'Cellroti export was successfully updated.'
      else
        render action: 'edit'
      end
    end

    # DELETE /cellroti_exports/1
    def destroy
      @cellroti_export.destroy
      redirect_to export_cellroti_exports_url
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_cellroti_export
        @cellroti_export = ::CellrotiExport.find(params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def cellroti_export_params
        params.require(:cellroti_export).permit(:name, :description)
      end
  end
end
