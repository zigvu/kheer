module ChiaData
  class DetectablesController < ApplicationController
    before_action :set_detectable, only: [:show, :edit, :update, :destroy]

    # GET /detectables
    # GET /detectables.json
    def index
      @detectables = ::Detectable.all
    end

    # GET /detectables/1
    # GET /detectables/1.json
    def show
    end

    # GET /detectables/new
    def new
      @detectable = ::Detectable.new
    end

    # GET /detectables/1/edit
    def edit
    end

    # POST /detectables
    # POST /detectables.json
    def create
      @detectable = ::Detectable.new(detectable_params)

      respond_to do |format|
        if @detectable.save
          format.html { redirect_to chia_data_detectable_url(@detectable), notice: 'Detectable was successfully created.' }
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
          format.html { redirect_to chia_data_detectable_url(@detectable), notice: 'Detectable was successfully updated.' }
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
      @detectable.destroy
      respond_to do |format|
        format.html { redirect_to chia_data_detectables_url }
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
        params.require(:detectable).permit(:name, :pretty_name, :description, :chia_version_id)
      end
  end
end