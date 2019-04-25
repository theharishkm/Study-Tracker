class SessionsController < ApplicationController
  skip_before_action :current_user
  protect_from_forgery with: :null_session
  def new
  end
  def create
    user = User.from_omniauth(request.env["omniauth.auth"])
    session[:user_id] = user.id
    if (user.email.match(/tamu.edu/))
      redirect_to root_path
    else
      session.delete(:user_id)
      flash[:warning] = "Login with your TAMU Net  ID Only. Log out from all GMAIL and try again."
      redirect_to signin_path
    end
  end

  def destroy
    session.delete(:user_id)
    @current_user = nil
    flash[:notice] = "To logout succesfully, log out from GMAIL as well"
    redirect_to root_path
  end
  
end
def googleAuth
    # Get access tokens from the google server
    access_token = request.env["omniauth.auth"]
    user = User.from_omniauth(access_token)
    log_in(user)
    # Access_token is used to authenticate request made from the rails application to the google server
    user.google_token = access_token.credentials.token
    # Refresh_token to request new access_token
    # Note: Refresh_token is only sent once during the first request
    refresh_token = access_token.credentials.refresh_token
    user.google_refresh_token = refresh_token if refresh_token.present?
    user.save
    redirect_to root_path
  end