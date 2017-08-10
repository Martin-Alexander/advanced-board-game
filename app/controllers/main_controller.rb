class MainController < ApplicationController
  def home
  end

  def input
    ActionCable.server.broadcast "game_channel", {
      playerNumber: params[:playerNumber],
      game: params[:game],
      extra: params[:extra]
    }
  end

  def damage
    ActionCable.server.broadcast "game_channel", {
      playerNumber: params[:playerNumber],
      token: "hi",
      fromSquare: params[:fromSquare],
      toSquare: params[:toSquare],
      fromDamage: params[:fromDamage],
      toDamage: params[:toDamage]
    }
  end    
end
