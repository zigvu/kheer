class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  protect_from_forgery with: :exception, :if => Proc.new { |c| c.request.format != Mime::JSON }
  # For APIs use :null_session instead.
  protect_from_forgery with: :null_session, :if => Proc.new { |c| c.request.format == Mime::JSON }
  acts_as_token_authentication_handler_for User
  #before_action :authenticate_user!

  # ensure HTML format
  def ensure_html_format
    if request.format != Mime::HTML
      raise ActionController::RoutingError, "Format #{params[:format].inspect} not supported for #{request.path.inspect}"
    end
  end

  # ensure JSON format
  def ensure_json_format
    if request.format != Mime::JSON
      raise ActionController::RoutingError, "Format #{params[:format].inspect} not supported for #{request.path.inspect}"
    end
  end
end
