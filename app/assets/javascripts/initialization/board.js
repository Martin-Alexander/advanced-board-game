function Board() {
  this.data = [];

  this.empty = function() {
    this.data = [];
  }

  this.square = function(x, y) {
    return this.data[ySize * y + x];
  }
}