module Messaging
  class RpcServer

    def initialize(bunnyConnection, serverQueueName, rpcHandlerObj)
      @connection = bunnyConnection
      @serverQueueName = serverQueueName
      @rpcHandlerObj = rpcHandlerObj
    end

    def start
      channel = @connection.create_channel
      serverQueue = channel.queue(@serverQueueName)
      exchange = channel.default_exchange

      # need a non-blocking connection else rails won't load
      serverQueue.subscribe(manual_ack: true) do |delivery_info, properties, payload|
        channel.ack(delivery_info.delivery_tag)
        response = @rpcHandlerObj.call(payload)

        exchange.publish(response, 
          routing_key: properties.reply_to,
          content_type: 'application/json',
          correlation_id: properties.correlation_id)
      end
    end

  end
end
