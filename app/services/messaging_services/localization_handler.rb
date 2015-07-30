require 'json'

module Services
  module MessagingServices
    class LocalizationHandler

      def initialize
        @hdr = Messaging::Headers
        # {chia_version_id: DataImporters::Formatters::LocalizationFormatter}
        @formatters = {}
        # {chia_version_id: {video_id: DataImporters::MongoCollectionDumper}}
        @dumpers = {}
      end

      def call(headers, message)
        # the header will have video_id and chia_version_id
        videoId = @hdr.getPropsVideoId(headers)
        chiaVersionId = @hdr.getPropsChiaVersionId(headers)

        responseHeaders = nil
        # begin
          if @hdr.isVideoStorageStart?(headers)
            startNewVideoStorage(videoId, chiaVersionId)
          elsif @hdr.isVideoStorageEnd?(headers)
            endExistingVideoStorage(videoId, chiaVersionId)
          elsif @hdr.isVideoStorageSave?(headers)
            localizations = JSON.parse(message)
            addToExistingVideoStorage(videoId, chiaVersionId, localizations)
          else
            raise "Unknown task headers"
          end
          responseHeaders = @hdr.getStatusSuccess()
        # rescue Exception => e
        #   responseHeaders = @hdr.getStatusFailure(e.message)
        # end

        responseMessage = {
          video_id: videoId,
          chia_version_id: chiaVersionId
        }
        return responseHeaders, responseMessage.to_json
      end

      def startNewVideoStorage(videoId, chiaVersionId)
        # create new formatter if doesn't exist yet
        @formatters[chiaVersionId] ||= DataImporters::Formatters::LocalizationFormatter.new(chiaVersionId)
        # create new dumper
        @dumpers[chiaVersionId] ||= {}
        if @dumpers[chiaVersionId][videoId] == nil
          @dumpers[chiaVersionId][videoId] = DataImporters::MongoCollectionDumper.new('Localization')
        else
          raise "Data import for video_id #{videoId} " + \
            "and chia_version_id #{chiaVersionId} already in progress"
        end
        # update kheer job state
        kheerJob = ::KheerJob.where(video_id: videoId).where(chia_version_id: chiaVersionId).first
        States::KheerJobState.new(kheerJob).setStartProcess
      end

      def endExistingVideoStorage(videoId, chiaVersionId)
        # finalize and delete the key for dumper
        @dumpers[chiaVersionId][videoId].finalize()
        @dumpers[chiaVersionId].delete(videoId)
        # if no dumper currently uses formatter, delete that as well
        @formatters.delete(chiaVersionId) if @dumpers[chiaVersionId].keys.empty?
        # create indices
        Localization.no_timeout.create_indexes
        # update summaries
        kheerJob = ::KheerJob.where(video_id: videoId).where(chia_version_id: chiaVersionId).first
        Metrics::Analysis::SummaryCounts.new(kheerJob).getSummaryCounts
        States::KheerJobState.new(kheerJob).setSuccessProcess
      end

      def addToExistingVideoStorage(videoId, chiaVersionId, localizations)
        localizations.each do |localization|
          formattedL = @formatters[chiaVersionId].getFormatted(localization)
          @dumpers[chiaVersionId][videoId].add(formattedL)
        end
      end

    end
  end
end
