require 'json'

module Services
  module MessagingServices
    class LocalizationHandler

      def initialize
        @hdr = Messaging::Headers
        # {chia_version_id: DataImporters::Formatters::LocalizationFormatter}
        @formatters = {}
        # {chia_version_id: {video_collection_id: DataImporters::MongoCollectionDumper}}
        @dumpers = {}
      end

      def call(headers, message)
        # the header will have video_collection_id and chia_version_id
        videoCollectionId = @hdr.getPropsVideoId(headers)
        chiaVersionId = @hdr.getPropsChiaVersionId(headers)

        responseHeaders = nil
        begin
          if @hdr.isVideoStorageStart?(headers)
            startNewVideoStorage(videoCollectionId, chiaVersionId)
          elsif @hdr.isVideoStorageEnd?(headers)
            endExistingVideoStorage(videoCollectionId, chiaVersionId)
          elsif @hdr.isVideoStorageSave?(headers)
            localizations = JSON.parse(message)
            addToExistingVideoStorage(videoCollectionId, chiaVersionId, localizations)
          else
            raise "Unknown task headers"
          end
          responseHeaders = @hdr.getStatusSuccess()
        rescue Exception => e
          responseHeaders = @hdr.getStatusFailure(e.message)
        end

        responseMessage = {
          video_id: videoCollectionId,
          chia_version_id: chiaVersionId
        }
        return responseHeaders, responseMessage.to_json
      end

      def startNewVideoStorage(videoCollectionId, chiaVersionId)
        # create new formatter if doesn't exist yet
        @formatters[chiaVersionId] ||= DataImporters::Formatters::LocalizationFormatter.new(chiaVersionId)
        # create new dumper
        @dumpers[chiaVersionId] ||= {}
        if @dumpers[chiaVersionId][videoCollectionId] == nil
          @dumpers[chiaVersionId][videoCollectionId] = DataImporters::MongoCollectionDumper.new('Localization')
        else
          raise "Data import for video_collection_id #{videoCollectionId} " + \
            "and chia_version_id #{chiaVersionId} already in progress"
        end
      end

      def endExistingVideoStorage(videoCollectionId, chiaVersionId)
        # finalize and delete the key for dumper
        @dumpers[chiaVersionId][videoCollectionId].finalize()
        @dumpers[chiaVersionId].delete(videoCollectionId)
        # if no dumper currently uses formatter, delete that as well
        @formatters.delete(chiaVersionId) if @dumpers[chiaVersionId].keys.empty?
        # create indices
        Localization.no_timeout.create_indexes
      end

      def addToExistingVideoStorage(videoCollectionId, chiaVersionId, localizations)
        localizations.each do |localization|
          formattedL = @formatters[chiaVersionId].getFormatted(localization)
          @dumpers[chiaVersionId][videoCollectionId].add(formattedL)
        end
      end

    end
  end
end
