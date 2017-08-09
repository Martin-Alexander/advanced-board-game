App.game = App.cable.subscriptions.create("GameChannel", {
  connected: function() {},
  disconnected: function() {},
  received: function(data) {
    if (currentPlayer.number != data.playerNumber) {
      updateGameFromJSON(JSON.parse(data.game));
    }
  }
});