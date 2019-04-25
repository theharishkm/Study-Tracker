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
