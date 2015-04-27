module ChiaData
  class DetectablesController < ApplicationController
    before_action :set_detectable, only: [:edit, :update, :destroy]

    # GET /detectables/new
    def new
      @detectable = ::Detectable.new
      @chia_version = ::ChiaVersion.find(detectable_params[:chia_version_id].to_i)
    end

    # GET /detectables/1/edit
    def edit
      @chia_version = @detectable.chia_version
    end

    # POST /detectables
    # POST /detectables.json
    def create
      @detectable = ::Detectable.new(detectable_params)

      respond_to do |format|
        if @detectable.save
          format.html { redirect_to chia_data_chia_version_url(@detectable.chia_version), notice: 'Detectable was successfully created.' }
          format.json { render action: 'show', status: :created, location: @detectable }
        else
          format.html { render action: 'new' }
          format.json { render json: @detectable.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /detectables/1
    # PATCH/PUT /detectables/1.json
    def update
      respond_to do |format|
        if @detectable.update(detectable_params)
          format.html { redirect_to chia_data_chia_version_url(@detectable.chia_version), notice: 'Detectable was successfully updated.' }
          format.json { head :no_content }
        else
          format.html { render action: 'edit' }
          format.json { render json: @detectable.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /detectables/1
    # DELETE /detectables/1.json
    def destroy
      chia_version = @detectable.chia_version
      @detectable.destroy
      respond_to do |format|
        format.html { redirect_to chia_data_chia_version_url(chia_version) }
        format.json { head :no_content }
      end
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_detectable
        @detectable = ::Detectable.find(params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def detectable_params
        params.require(:detectable).permit(:name, :pretty_name, :description, :chia_version_id, :chia_detectable_id)
      end
  end
end