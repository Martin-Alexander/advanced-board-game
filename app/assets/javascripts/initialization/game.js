var game = {
  turnNumber: 0,
  playerOne: undefined,
  playerTwo: undefined,
  turnplayer: function() {
    if (this.playerOne.isTurnPlayer) {
      return this.playerOne;
    } else {
      return this.playerTwo;
    }
  }
}

game.generateNewBoard = function() {
  this.globalBoard.empty();
  for (var y = 0; y < ySize; y++) {
    for (var x = 0; x < xSize; x++) {
      var newSquare = new Square(x, y);
      newSquare.board = this.globalBoard.data;
      newSquare.player = null;
      newSquare.terrain = "grass";
      newSquare.structure = null;
      this.globalBoard.data.push(newSquare);
    }
  }
}