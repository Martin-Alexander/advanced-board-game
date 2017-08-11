class MainController < ApplicationController
  def home
  end

  def input
    Game.first.data = params[:game]
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

  def join_game
    role = params[:role]
    player_one = Game.first.player_one
    player_two = Game.first.player_two

    if role == "observer"
      join_as("observer")
    elsif role == "playerOne"
      player_one ? join_as("playerOne", player_one) : join_as("observer", player_one)
    elsif role == "playerTwo"
      player_two ? join_as("playerTwo", player_two) : join_as("observer", player_two)
    end
  end

  def game_over
    Game.first.player_one = false
    Game.first.player_two = false
    Game.first.data = ""
  end

  def is_there_a_game
    if Game.first.data.length > 0
      render text: "true"
    else
      render text: "false"
    end
  end

  def join_as(status, other_player_status) 
    ActionCable.server.broadcast "game_channel", {
      joinAs: status,
      otherPlayer: other_player_status
    }
  end
end
