
# TODO: get from config
# TODO: test if needs to be pulled into puma

$cellrotiURL = "http://localhost:3001/api/v1/stream"
$cellroti_api_user_email = "zigvu_admin@zigvu.com"
$cellroti_api_token = "Vyu5Zyq4yazzaUSBWFw6"

class CellrotiTokenAuthentication < Faraday::Middleware
  def call(env)
    env[:request_headers]["X-User-Email"] = $cellroti_api_user_email
    env[:request_headers]["X-User-Token"] = $cellroti_api_token

    @app.call(env)
  end
end

Her::API.setup url: $cellrotiURL do |c|
  # Authentication
  c.use CellrotiTokenAuthentication

  # Request
  c.use Faraday::Request::UrlEncoded

  # Response
  c.use Her::Middleware::DefaultParseJSON

  # Adapter
  c.use Faraday::Adapter::NetHttp
end
