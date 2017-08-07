function Hand() {

  // Simple coordinate objects (x, y)
  this.mousePosition = {};
  this.mouseIsoPosition = {};
  this.trueMousePosition = {};

  // Square objections (potentially VisionSquare objects)
  this.hoverTile;
  this.selectedTile = null;
  var clickedTile;
  this.offset = { x: 0, y: 0 };
  var canvasCenter = { x: canvasWidth / 2, y: canvasHeight / 2 };

  this.click = function() {

    // Warning, basing hand logic on the global board might give a player 
    // information from outside thier line of sight. Should eventually be 
    // changed to the player board
    clickedTile = game.globalBoard.square(this.hoverTile.x, this.hoverTile.y);

    // Clicked outside of board bounds?
    if (!clickedTile) { return false; }

    if (this.selectedTile == null && clickedTile.units.length > 0) {
      this.selectedTile = clickedTile;
    } else if (this.selectedTile) {
      game.move(this.selectedTile, clickedTile);
      this.selectedTile = null;
    } else {
      canvasContext.translate(canvasCenter.x - this.trueMousePosition.x, canvasCenter.y - this.trueMousePosition.y);
      this.offset.x = this.offset.x + (canvasCenter.x - this.trueMousePosition.x);
      this.offset.y = this.offset.y + (canvasCenter.y - this.trueMousePosition.y);
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