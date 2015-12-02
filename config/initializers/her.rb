
cellrotiConfig = YAML.load_file(Rails.root.join('config','cellroti_config.yml'))[Rails.env]

$cellroti_URL = cellrotiConfig["cellroti_URL"]
$cellroti_api_user_email = cellrotiConfig["cellroti_api_user_email"]
$cellroti_api_token = cellrotiConfig["cellroti_api_token"]
$cellroti_ssl_cert_path = cellrotiConfig["cellroti_ssl_cert_path"]

class CellrotiTokenAuthentication < Faraday::Middleware
  def call(env)
    env[:request_headers]["X-User-Email"] = $cellroti_api_user_email
    env[:request_headers]["X-User-Token"] = $cellroti_api_token

    @app.call(env)
  end
end

def setupConnection(connection)
  # Authentication
  connection.use CellrotiTokenAuthentication

  # Request
  connection.use Faraday::Request::Multipart
  connection.use Faraday::Request::UrlEncoded

  # Response
  connection.use Her::Middleware::DefaultParseJSON

  # Adapter
  connection.use Faraday::Adapter::NetHttp
end

if Rails.env == 'production'
  # use ssl in production
  ssl_options = { ca_path: $cellroti_ssl_cert_path }
  Her::API.setup url: $cellroti_URL, ssl: ssl_options do |connection|
    setupConnection(connection)
  end
else
  Her::API.setup url: $cellroti_URL do |connection|
    setupConnection(connection)
  end
end
