App.game = App.cable.subscriptions.create("GameChannel", {
  connected: function() {},
  disconnected: function() {},
  received: function(data) {
    if (currentPlayer.number != data.playerNumber) {
      var gameData = JSON.parse(data.game);
      game.globalBoard = gameData.globalBoard;
    }
  }
});