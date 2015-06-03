
# Note: this file corresponds to khajuri/messaging/type/Headers.py
module Messaging
  class Headers

    def self.getStatusSuccess
      headers = {
        type: 'status',
        state: 'failure',
        props: {}
      }
      headers
    end

    def self.getStatusFailure(failureCause)
      headers = {
        type: 'status',
        state: 'failure',
        props: { cause: failureCause }
      }
      headers
    end

    def self.isVideoStorageStart?(headers)
      headers['type'] == 'data' and headers['state'] == 'video.storage.start'
    end

    def self.isVideoStorageEnd?(headers)
      headers['type'] == 'data' and headers['state'] == 'video.storage.end'
    end

    def self.isVideoStorageSave?(headers)
      headers['type'] == 'data' and headers['state'] == 'video.storage.save'
    end

    def self.getPropsVideoId(headers)
      headers['props']['video_id'].to_i
    end

    def self.getPropsChiaVersionId(headers)
      headers['props']['chia_version_id'].to_i
    end

  end
end
