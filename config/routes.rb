Rails.application.routes.draw do
  resources :sessions do
    resources :subjects
  end
  get 'setup/index'
  get 'setup/edit'
  get 'setup/new'
  get 'setup/destroy'
  root 'dashboard#index'
  get 'calendar/index', to: 'calendar#index'
  get 'dashboard/index'
  get '/signin',   to: 'sessions#new'
  post '/signin',   to: 'sessions#create'
  get 'login', to: redirect('/auth/google_oauth2'), as: 'login'
  get '/logout', to: 'sessions#destroy', as: 'logout'
  get  'auth/:provider/callback' => 'sessions#create'
  get 'signout', to: 'sessions#destroy', as: 'signout'
#  get  'auth/google_oauth2', :as => 'login'
  get 'auth/failure', to: redirect('/')
  post 'setup/create', to: 'setup#create'
  post 'dashboard/update', to: 'dashboard#update'
  get 'me', to: 'me#show', as: 'me'
  
  resources :sessions, only: [:create, :destroy]
#  resource :home, only: [:show]

end
