function Player() {
  this.number;       // 1 or 2
  this.isTurnPlayer; // true or false
  this.gold;
  this.vision;
  this.numberOfFarms;
  this.numberOfBases;
}

// Sets every square of a players vision to "black"
Player.prototype.blind = function blindPlayer() {
  this.vision.data = [];
  for (var y = 0; y < ySize; y++) {
    for (var x = 0; x < xSize; x++) {
      var newVisionSquare = new VisionSquare(x, y);
      newVisionSquare.status = "black";
      this.vision.data.push(newVisionSquare);
    }
  }
}

// Sets every square of a players vision to "black"
Player.prototype.observerVision = function observerVision() {
  this.vision.data = [];
  for (var y = 0; y < ySize; y++) {
    for (var x = 0; x < xSize; x++) {
      var newVisionSquare = new VisionSquare(x, y);
      newVisionSquare.status = "visible";
      this.vision.data.push(newVisionSquare);
    }
  }
}