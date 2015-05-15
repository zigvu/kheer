module Services
  module MessagingServices
    class HeatmapData

      def initialize
        @heatmapRpcClient = HEATMAPDATA_RPC
      end

      def getData(chiaVersionId, videoId, frameNumber, scale, detectableId)
        videoCollectionId = Video.find(videoId).video_collection.id
        chiaDetId = ChiaVersionDetectable.where(chia_version_id: chiaVersionId)
          .where(detectable_id: detectableId).first.chia_detectable_id

        request = {
          video_collection_id: videoCollectionId,
          video_id: videoId,
          chia_version_id: chiaVersionId,
          frame_number: frameNumber,
          scale: scale,
          chia_det_id: chiaDetId
        }
        # format of return value (already JSONed) :
        # {scores: [cell_map_values, ]}

        @heatmapRpcClient.call(request.to_json)
      end

    end
  end
end