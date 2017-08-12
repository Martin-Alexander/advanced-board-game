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

    if role == "playerOne" && !player_one

      Game.first.update(player_one: true)
      join_as("playerOne", player_two);
      
    elsif role == "playerTwo" && !player_two

      Game.first.update(player_two: true)
      join_as("playerTwo", player_one);

    else 

      join_as("observer", player_one && player_two) 

    end
  end

  def game_over
    Game.first.update(player_one: false)
    Game.first.update(player_two: false)
    Game.first.data = ""
  end

  def is_there_a_game
    player_one = Game.first.player_one
    player_two = Game.first.player_two
    game_exists = Game.first.data.length > 0

    render json: {
      player_one: player_one,
      player_two: player_two,
      game_exists: game_exists
    }

  end

  def join_as(role, other_player_ready) 
    render json: {
      role: role,
      otherPlayerReady: other_player_ready
    }
  end
end
