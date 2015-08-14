
# TODO: get from config
# TODO: test if needs to be pulled into puma

$cellroti_URL = "http://localhost:3001/api/stream"
$cellroti_api_user_email = "zigvu_admin@zigvu.com"
$cellroti_api_token = "Vyu5Zyq4yazzaUSBWFw6"
$cellroti_ssl_cert_path = "/usr/lib/ssl/certs"

class CellrotiTokenAuthentication < Faraday::Middleware
  def call(env)
    env[:request_headers]["X-User-Email"] = $cellroti_api_user_email
    env[:request_headers]["X-User-Token"] = $cellroti_api_token

    @app.call(env)
  end
end

# ssl_options = { ca_path: $cellroti_ssl_cert_path }
# Her::API.setup url: $cellroti_URL, ssl: ssl_options do |c|

Her::API.setup url: $cellroti_URL do |c|
  # Authentication
  c.use CellrotiTokenAuthentication

  # Request
  c.use Faraday::Request::UrlEncoded

  # Response
  c.use Her::Middleware::DefaultParseJSON

  # Adapter
  c.use Faraday::Adapter::NetHttp
end
