Rails.application.routes.draw do
  root 'main#home'
  post '/input', to: 'main#input'
  post '/damage', to: 'main#damage'
  post '/join_game', to: 'main#join_game'
  post '/game_over', to: 'main#game_over'
  post '/is_there_a_game', to: 'main#is_there_a_game'
end
