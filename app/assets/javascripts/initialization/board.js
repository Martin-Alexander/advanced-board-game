function Board() {
  this.data = [];

  this.empty = function() {
    this.data = [];
  }

  this.square = function(x, y) {
    if (x < 0 || x >= xSize || y < 0 || y >= ySize) { return undefined; }
    return this.data[ySize * y + x];
  }
}