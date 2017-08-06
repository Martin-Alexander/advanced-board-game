function Square() {
  this.x;
  this.y;
  this.terrain;   // "grass", "mountain", "water"
  this.structure; // "none", "farm", "base"
  this.player;    // A player object
  this.units = [];
}

function VisionSquare() {
  this.x;
  this.y;
  this.status;    // "black", "fog", "visible"
}