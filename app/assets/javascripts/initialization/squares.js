function Square(x, y) {
  this.board      // The board that the square belongs to 
  this.x = x;
  this.y = y;
  this.terrain;   // "grass", "mountain", "water"
  this.structure; // "none", "farm", "base"
  this.player;    // A player object
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
      coords[0] > xSize ||
      coords[0] < 0 ||
      coords[1] > ySize ||
      coords[1] < 0
    ) {
      output.push(false);
    } else {
      output.push(this.board.square(coords[0], coords[1]));
    }
  }

  return output;
}

Square.prototype.neighbours = neighbours;
VisionSquare.prototype.neighbours = neighbours;