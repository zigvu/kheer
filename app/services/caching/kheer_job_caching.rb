module Services::Caching
  class KheerJobCaching

  def initialize(kheerJob)
    @kheerJob = kheerJob
  end

  def create
    # TODO: check if already initailized
    enqueue()
  end

  def enqueue
    kheerJobCacheCreationHash = {
      kheer_job_id: @kheerJob.id,
    }
    Delayed::Job.enqueue ::KheerJobCacheCreation.new(
      kheerJobCacheCreationHash), :queue => 'kheerJobCacheCreation', :priority => 20
  end

  end
end
