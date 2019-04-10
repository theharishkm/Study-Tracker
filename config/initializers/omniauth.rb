OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, "736229063936-r10uu5furtoinlo3i8u2fr5abk87c1k0.apps.googleusercontent.com", "kPDcYU8tpv3zFOrlT683mtI_"
end
