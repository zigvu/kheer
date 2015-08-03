class KheerJobCacheCreation < Struct.new(:kheerJobCacheCreationHash)
  def perform
    kheerJobId = kheerJobCacheCreationHash[:kheer_job_id]
    kheerJob = KheerJob.find(kheerJobId)

    # update summaries
    Metrics::Analysis::SummaryCounts.new(kheerJob).getSummaryCounts
    # create confusion matrix
    Metrics::Analysis::ConfusionMatrix.new(kheerJob).computeAndSaveConfusions
    return true
  end

  def display_name
    kheerJobId = kheerJobCacheCreationHash[:kheer_job_id]
    return "NewKheerJobCacheCreation_#{kheerJobId}"
  end
  
  def max_run_time
    10.hours
  end

  def enqueue
  end

  def before
  end

  def after
  end

  def success
    kheerJobId = kheerJobCacheCreationHash[:kheer_job_id]
    kheerJob = KheerJob.find(kheerJobId)
    States::KheerJobState.new(kheerJob).setSuccessProcess
  end

  def error(job, exception)
    # on error, it will retry, so don't count it out yet
  end

  def failure
    kheerJobId = kheerJobCacheCreationHash[:kheer_job_id]
    kheerJob = KheerJob.find(kheerJobId)
    States::KheerJobState.new(kheerJob).setFailProcess
  end

end
