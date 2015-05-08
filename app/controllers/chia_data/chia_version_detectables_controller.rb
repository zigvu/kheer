module ChiaData
  class ChiaVersionDetectablesController < ApplicationController
    before_action :set_chia_version_detectable, only: [:edit, :update, :destroy]
    before_action :set_chia_version, only: [:edit, :update]

    # GET /chia_version_detectables/1/edit
    def edit
    end

    # PATCH/PUT /chia_version_detectables/1
    # PATCH/PUT /chia_version_detectables/1.json
    def update
      respond_to do |format|
        if @chia_version_detectable.update(chia_version_detectable_params)
          format.html { redirect_to chia_data_chia_version_url(@chia_version), notice: 'Detectable was successfully updated.' }
          format.json { head :no_content }
        else
          format.html { render action: 'edit' }
          format.json { render json: @chia_version_detectable.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /chia_version_detectables/1
    # DELETE /chia_version_detectables/1.json
    def destroy
      @chia_version = @chia_version_detectable.chia_version
      @chia_version_detectable.destroy
      respond_to do |format|
        format.html { redirect_to chia_data_chia_version_url(@chia_version) }
        format.json { head :no_content }
      end
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_chia_version_detectable
        @chia_version_detectable = ::ChiaVersionDetectable.find(params[:id])
      end

      def set_chia_version
        @chia_version = ::ChiaVersion.find(chia_version_detectable_params[:chia_version_id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def chia_version_detectable_params
        params.require(:chia_version_detectable).permit(:chia_version_id, :detectable_id, :chia_detectable_id)
      end
  end
end