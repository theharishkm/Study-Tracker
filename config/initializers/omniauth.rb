OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, "800939539080-lkvdn1bnk9036nnqc2h7ifcbbk9ufhcm.apps.googleusercontent.com", "bTMTzTWC-RbuGBUJeuXIw_18"
end
