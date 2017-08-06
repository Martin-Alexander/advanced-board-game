function Player() {
  this.number;       // 1 or 2
  this.isTurnPlayer; // true or false
  this.gold;
  this.vision;
}

// Sets every square of a players vision to "black"
Player.prototype.blind = function blindPlayer() {
  for (var y = 0; y < ySize; y++) {
    for (var x = 0; x < xSize; x++) {
      var newVisionSquare = new VisionSquare(x, y);
      newVisionSquare.status = "black";
      newVisionSquare.board = this.vision;
      this.vision.data.push << newVisionSquare;
    }
  }
}