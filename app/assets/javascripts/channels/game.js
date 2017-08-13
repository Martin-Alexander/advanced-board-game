App.game = App.cable.subscriptions.create("GameChannel", {
  connected: function() {},
  disconnected: function() {},
  received: function(data) {

    if (data.gameOver) {
      updateGameFromJSON(JSON.parse(data.game));
    }

    if (((currentPlayer.number != data.playerNumber && !currentPlayer.isTurnPlayer) || !boardHasBeenGenerated) && !game.over) {
      boardHasBeenGenerated = true;
      if (data.token == "hi") {
        hand.drawDamage = {
          fromSquare: game.globalBoard.square(parseInt(data.fromSquare[0]), parseInt(data.fromSquare[1])),
          toSquare: game.globalBoard.square(parseInt(data.toSquare[0]), parseInt(data.toSquare[1])),
          fromDamage: parseInt(data.fromDamage),
          toDamage: parseInt(data.toDamage)
        };
      } else {
        updateGameFromJSON(JSON.parse(data.game));
      }
    if (currentPlayer.isTurnPlayer) { document.title = "Your Turn!"; }
    }
  }
});