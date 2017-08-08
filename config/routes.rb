Rails.application.routes.draw do
  root 'main#home'
  post '/input', to: 'main#input'
end
