# Bunny config
# @author: Evan

module BunnyConnections
  class << self
    def heatmap_client
      if @heatmap_client == nil
        # start heatmap client
        bc = Messaging::BunnyConnection.new(Rails.configuration.bunny.amqp_url).connection
        @heatmap_client = Messaging::RpcClient.new(bc, 
            Rails.configuration.bunny.heatmap_data_request, 
            Rails.configuration.bunny.heatmap_data_response)
      end
      @heatmap_client
    end

    def start_ingest_servers
      bc = Messaging::BunnyConnection.new(Rails.configuration.bunny.amqp_url).connection
      # start clip id handler server
      clipIdHandler = Services::MessagingServices::ClipIdHandler.new()
      Messaging::RpcServer.new(bc, 
        Rails.configuration.bunny.clip_id_request, 
        clipIdHandler
      ).start

      # start localization data handler server
      localizationHandler = Services::MessagingServices::LocalizationHandler.new()
      Messaging::RpcServer.new(bc, 
        Rails.configuration.bunny.localization_request, 
        localizationHandler
      ).start
    end
  end
end
