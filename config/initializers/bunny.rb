# Bunny config
# @author: Evan

# define names
amqp_url = ENV.keys.include?("AMQP_URL") ? ENV.fetch("AMQP_URL") : nil
heatmap_data_request = 'vm2.kheer.development.heatmap_rpc.request'
heatmap_data_response = 'vm2.kheer.development.heatmap_rpc.response'

bunnyConnection = Messaging::BunnyConnection.new(amqp_url).connection
HEATMAPDATA_RPC = Messaging::RpcClient.new(bunnyConnection, heatmap_data_request, heatmap_data_response)
