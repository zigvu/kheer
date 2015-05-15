module Messaging
  class RpcClient

    def initialize(bunnyConnection, serverQueueName, replyQueueName)
      @connection = bunnyConnection
      @serverQueueName = serverQueueName
      @replyQueueName = replyQueueName
    end

    def call(message)
      channel = @connection.create_channel
      exchange = channel.default_exchange
      replyQueue = channel.queue(@replyQueueName)
      correlationId = SecureRandom.uuid

      exchange.publish(message,
        routing_key: @serverQueueName,
        content_type: 'application/json',
        correlation_id: correlationId,
        reply_to: @replyQueueName)

      retVal = nil
      replyQueue.subscribe(manual_ack: true, block: true, time_out: 20) do |delivery_info, properties, payload|
        if properties[:correlation_id] == correlationId
          retVal = payload
          channel.ack(delivery_info.delivery_tag)
          channel.close
        end
      end
      retVal
    end
  end
end
