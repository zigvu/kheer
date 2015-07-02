# Bunny config
# @author: Evan

# define names
# if rabbit is connected to localhost, leaving amqp_url to nil is fine
amqp_url = nil
log_request = nil
clip_id_request = nil
heatmap_data_request = nil
heatmap_data_response = nil
localization_request = nil

if Rails.env.production?
  log_request = 'production.log'
  clip_id_request = 'production.clip_id.request'
  heatmap_data_request = 'production.heatmap.request'
  heatmap_data_response = 'production.heatmap.response'
  localization_request = 'production.localization.request'
elsif Rails.env.development?
  log_request = 'development.log'
  clip_id_request = 'development.clip_id.request'
  heatmap_data_request = 'development.heatmap.request'
  heatmap_data_response = 'development.heatmap.response'
  localization_request = 'development.localization.request'
else
  raise "No queue set up for non development/production environments"
end
    
bunnyConnection = Messaging::BunnyConnection.new(amqp_url).connection
HEATMAPDATA_RPC = Messaging::RpcClient.new(
    bunnyConnection, heatmap_data_request, heatmap_data_response)

clipIdHandler = Services::MessagingServices::ClipIdHandler.new()
Messaging::RpcServer.new(bunnyConnection, clip_id_request, clipIdHandler).start

localizationHandler = Services::MessagingServices::LocalizationHandler.new()
Messaging::RpcServer.new(bunnyConnection, localization_request, localizationHandler).start
