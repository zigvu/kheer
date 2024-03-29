module ChiaData
  class ChiaVersionsController < ApplicationController
    before_action :set_chia_version, only: [:show, :show_annotations, :edit, 
      :update, :destroy, :all_addable_detectables, :add_detectables]

    # GET /chia_versions
    # GET /chia_versions.json
    def index
      @chia_versions = ::ChiaVersion.all
    end

    # GET /chia_versions/1
    # GET /chia_versions/1.json
    def show
      @chiaSerializer = Serializers::ChiaVersionSettingsSerializer.new(@chia_version)
      @chia_versions = ::ChiaVersion.where(ctype: @chia_version.ctype) - [@chia_version]
      @chiaVersionDetectables = @chia_version
        .chia_version_detectables
        .order(:chia_detectable_id => :asc)
    end

    # GET /chia_versions/1/show_annotations
    def show_annotations
      @chiaVersionDetectables = @chia_version
        .chia_version_detectables
        .order(:chia_detectable_id => :asc)
    end

    # GET /chia_versions/new
    def new
      @chia_version = ::ChiaVersion.new
    end

    # GET /chia_versions/1/edit
    def edit
      chiaSerializer = Serializers::ChiaVersionSettingsSerializer.new(@chia_version)
      @zDistThreshs = chiaSerializer.getSettingsZdistThresh.to_s
      @scales = chiaSerializer.getSettingsScales.to_s
    end

    # POST /chia_versions
    # POST /chia_versions.json
    def create
      @chia_version = ::ChiaVersion.new(chia_version_params)

      respond_to do |format|
        if @chia_version.save
          format.html { 
            update_chia_version_settings()

            # TODO: REMOVE
            kheerSeed = Rails.root.join('public','data','kheerSeed').to_s
            cellMapFile = "#{kheerSeed}/cell_map.json"
            colorMapFile = "#{kheerSeed}/color_map.json"
            pmf = DataImporters::CreateMaps.new(cellMapFile, colorMapFile)
            pmf.saveToDb(@chia_version)
            # END TODO

            redirect_to chia_data_chia_version_url(@chia_version), notice: 'Chia version was successfully created.' 
          }
          format.json { render action: 'show', status: :created, location: @chia_version }
        else
          format.html { render action: 'new' }
          format.json { render json: @chia_version.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /chia_versions/1
    # PATCH/PUT /chia_versions/1.json
    def update
      respond_to do |format|
        if @chia_version.update(chia_version_params)
          format.html { 
            update_chia_version_settings()
            redirect_to chia_data_chia_version_url(@chia_version), notice: 'Chia version was successfully updated.' 
          }
          format.json { head :no_content }
        else
          format.html { render action: 'edit' }
          format.json { render json: @chia_version.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /chia_versions/1
    # DELETE /chia_versions/1.json
    def destroy
      @chia_version.destroy
      respond_to do |format|
        format.html { redirect_to chia_data_chia_versions_url }
        format.json { head :no_content }
      end
    end

    # manage detectables

    # GET /chia_versions/1/all_addable_detectables
    def all_addable_detectables
      chiaVersionId = params[:chia_version_id]
      allDetectableIds = ::Detectable.all.pluck(:id)
      selfDetectableIds = @chia_version.chia_version_detectables.pluck(:detectable_id)
      @detectables = ::Detectable.where(id: (allDetectableIds - selfDetectableIds))
      @incomingChiaVersionId = nil
    end


    # GET /chia_versions/1/list_detectables.js
    def list_detectables
      @incomingChiaVersionId = params[:chia_version_id].to_i
      @detectables = ::Detectable.joins(:chia_version_detectables)
        .where(chia_version_detectables: {chia_version_id: @incomingChiaVersionId})
      respond_to do |format|
        format.js
      end
    end

    # GET /chia_versions/1/add_detectables
    def add_detectables
      selfDetectableIds = @chia_version.chia_version_detectables.pluck(:detectable_id)
      params[:detectable_ids].map{ |d| d.to_i }.each do |dId|
        if not selfDetectableIds.include?(dId)
          incomingChiaVersionId = params[:incoming_chia_version_id]
          if incomingChiaVersionId == nil || incomingChiaVersionId == ""
            @chia_version.chia_version_detectables.create(detectable_id: dId)
          else
            chiaDetectableId = ::ChiaVersionDetectable.where(
                chia_version_id: incomingChiaVersionId.to_i,
                detectable_id: dId
              ).first.chia_detectable_id

            @chia_version.chia_version_detectables
              .create(detectable_id: dId, chia_detectable_id: chiaDetectableId)
          end
        end
      end

      redirect_to chia_data_chia_version_url(@chia_version), notice: 'Detectables added'
    end


    private
      def update_chia_version_settings
        chiaSerializer = Serializers::ChiaVersionSettingsSerializer.new(@chia_version)
        zDistThreshs = params["zDistThreshs"][1..-2].split(",").map{ |s| s.to_f }
        chiaSerializer.replaceSettingsZdistThresh(zDistThreshs)
        scales = params["scales"][1..-2].split(",").map{ |s| s.to_f }
        chiaSerializer.replaceSettingsScales(scales)
      end

      # Use callbacks to share common setup or constraints between actions.
      def set_chia_version
        @chia_version = ::ChiaVersion.find(params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def chia_version_params
        params.require(:chia_version).permit(:name, :description, :comment, :ctype)
      end
  end
end