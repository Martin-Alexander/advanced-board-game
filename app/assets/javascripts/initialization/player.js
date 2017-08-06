function Player() {
  this.number;       // 1 or 2
  this.isTurnPlayer; // true or false
  this.gold;
  this.vision;
}

Player.prototype.blind = function blindPlayer(player) {
  for (var y = 0; y < ySize; y++) {
    for (var x = 0; x < xSize; x++) {
      var newVisionSquare = new VisionSquare(x, y);
      newVisionSquare.status = "black";
      newVisionSquare.board = player.vision;
      player.vision.data.push << newVisionSquare;
    }
  }
}