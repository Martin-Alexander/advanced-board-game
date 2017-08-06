function Square(x, y) {
  this.board      // The board that the square belongs to 
  this.x = x;
  this.y = y;
  this.terrain;   // "grass", "mountain", "water"
  this.structure; // null, "farm", "base"
  this.player;    // A player object or null
  this.units = [];
}

function VisionSquare(x, y) {
  this.board      // The board that the square belongs to 
  this.x = x;
  this.y = y;
  this.status;    // "black", "fog", "visible"
}

// Returns an array of adjacent squares (in the case of the edge of the board
// false is return)
function neighbours() {

  var output = [];

  var relativePosition = [
    [-1, 1], [0, 1], [1, 1],
    [-1, 0], [1, 0],
    [-1, -1], [0, -1], [1, -1]
  ]

  for (var i = 0; i < 8; i++) {
    var coords = relativePosition[i];
    if (
      this.x + coords[0] >= xSize ||
      this.x + coords[0] < 0 ||
      this.y + coords[1] >= ySize ||
      this.y +coords[1] < 0
    ) {
      output.push(false);
    } else {
      output.push(this.board.square(this.x + coords[0], this.y + coords[1]));
    }
  }

  return output;
}

Square.prototype.neighbours = neighbours;
VisionSquare.prototype.neighbours = neighbours;