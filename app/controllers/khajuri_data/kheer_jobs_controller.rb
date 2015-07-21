module KhajuriData
  class KheerJobsController < ApplicationController
    before_action :set_kheer_job, only: [:show, :destroy]

    # GET /kheer_jobs
    # GET /kheer_jobs.json
    def index
      @kheer_jobs = ::KheerJob.all
    end

    # GET /kheer_jobs/1
    # GET /kheer_jobs/1.json
    def show
    end

    # GET /kheer_jobs/new
    def new
      @kheer_job = ::KheerJob.new
    end

    # POST /kheer_jobs
    # POST /kheer_jobs.json
    def create
      @kheer_job = ::KheerJob.new(kheer_job_params)

      respond_to do |format|
        if @kheer_job.save
          format.html { 
            States::KheerJobState.new(@kheer_job).setNew
            redirect_to khajuri_data_kheer_job_url(@kheer_job), notice: 'Kheer job was successfully created.' 
          }
          format.json { render action: 'show', status: :created, location: @kheer_job }
        else
          format.html { render action: 'new' }
          format.json { render json: @kheer_job.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /kheer_jobs/1
    # DELETE /kheer_jobs/1.json
    def destroy
      @kheer_job.destroy
      respond_to do |format|
        format.html { redirect_to khajuri_data_kheer_jobs_url }
        format.json { head :no_content }
      end
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_kheer_job
        @kheer_job = ::KheerJob.find(params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def kheer_job_params
        params.require(:kheer_job).permit(:video_id, :chia_version_id)
      end
  end
end
