OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, "612468997814-fspigmuf8jpk6l6tbpl6lm4hl3vf21qt.apps.googleusercontent.com", "7MIm74F-tl-6v-XRlNmvsyW2"
end
