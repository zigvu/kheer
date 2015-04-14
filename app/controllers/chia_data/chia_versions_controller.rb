module ChiaData
  class ChiaVersionsController < ApplicationController
    before_action :set_chia_version, only: [:show, :edit, :update, :destroy]

    # GET /chia_versions
    # GET /chia_versions.json
    def index
      @chia_versions = ::ChiaVersion.all
    end

    # GET /chia_versions/1
    # GET /chia_versions/1.json
    def show
    end

    # GET /chia_versions/new
    def new
      @chia_version = ::ChiaVersion.new
    end

    # GET /chia_versions/1/edit
    def edit
    end

    # POST /chia_versions
    # POST /chia_versions.json
    def create
      @chia_version = ::ChiaVersion.new(chia_version_params)

      respond_to do |format|
        if @chia_version.save
          format.html { redirect_to chia_data_chia_version_url(@chia_version), notice: 'Chia version was successfully created.' }
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
          format.html { redirect_to chia_data_chia_version_url(@chia_version), notice: 'Chia version was successfully updated.' }
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

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_chia_version
        @chia_version = ::ChiaVersion.find(params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def chia_version_params
        params.require(:chia_version).permit(:name, :description, :comment)
      end
  end
end