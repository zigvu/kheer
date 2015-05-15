require "bunny"

module Messaging
  class BunnyConnection
    attr_reader :connection

    def initialize(amqp_url)
      if amqp_url == nil
        @connection = Bunny.new
      else
        @connection = Bunny.new(amqp_url)
      end
      @connection.start

      at_exit { @connection.close }
    end
  end
end