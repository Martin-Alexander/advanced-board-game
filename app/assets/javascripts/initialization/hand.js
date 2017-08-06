function Hand() {

  // Simple coordinate objects (x, y)
  this.mousePosition = {};
  this.mouseIsoPosition = {};

  // Square objections (potentially VisionSquare objects)
  this.hoverTile;
  this.selectedTile = null;
  var clickedTile;

  this.click = function() {

    // Warning, basing hand logic on the global board might give a player 
    // information from outside thier line of sight. Should eventually be 
    // changed to the player board
    clickedTile = game.globalBoard.square(this.hoverTile.x, this.hoverTile.y);

    // Clicked outside of board bounds?
    if (!clickedTile) { return false; }

    if (this.selectedTile == null) {
      this.selectedTile = clickedTile;
    } else if (this.selectedTile) {
      game.move(this.selectedTile, clickedTile);
      this.selectedTile = null;
    }

  }

  this.render = function() {
    if (this.selectedTile) {
      drawSquareShape("rgba(255, 255, 255, 0.8)", this.selectedTile.x, this.selectedTile.y);
    }
    if (this.hoverTile) {
      drawSquareShape("rgba(255, 255, 255, 0.2)", this.hoverTile.x, this.hoverTile.y);
    }
  }
}