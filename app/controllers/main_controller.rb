class MainController < ApplicationController
  def home
  end

  def input
    ActionCable.server.broadcast "game_channel", {
      playerNumber: params[:playerNumber],
      game: params[:game]
    }
  end
end
