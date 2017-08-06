var game = {
  turnNumber: 0,
  playerOne: undefined,
  playerOne: undefined,
  globalBoard: [],
  turnplayer: function() {
    if (this.playerOne.isTurnPlayer) {
      return this.playerOne;
    } else {
      return this.playerTwo;
    }
  }
}