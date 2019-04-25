class ApplicationController < ActionController::Base
    before_action :current_user 
    protect_from_forgery with: :exception
      helper_method :current_user

    def current_user
        @current_user = User.find_by_id(session[:user_id])
        redirect_to signin_path and return unless @current_user
    end
    
    around_action :set_time_zone

    private

    def set_time_zone
        Time.use_zone('Central Time (US & Canada)') { yield }
    end
end

# comment