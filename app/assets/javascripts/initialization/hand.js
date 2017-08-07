function Hand() {

  // Simple coordinate objects (x, y)
  this.mousePosition = {};
  this.mouseIsoPosition = {};
  this.trueMousePosition = {};

  // Square objects (potentially VisionSquare objects)
  this.hoverTile;
  this.selectedTile = null;

  var clickedTile;
  var canvasCenter = { x: canvasWidth / 2, y: canvasHeight / 2 };
  
  this.offset = { x: 0, y: 0 };

  this.unitTypeSelect = null;

  this.click = function() {

    // Warning, basing hand logic on the global board might give a player 
    // information from outside thier line of sight. Should eventually be 
    // changed to the player board
    clickedTile = game.globalBoard.square(this.hoverTile.x, this.hoverTile.y);

    // Clicked outside of board bounds?
    if (!clickedTile) { return false; }

    // Are you clicking a box?
    if (this.trueMousePosition.x > canvasWidth - rightBoxWidth || (this.trueMousePosition.y > canvasHeight - leftBoxHeight && this.trueMousePosition.x < leftBoxWidth)) { 
      
      // TODO: Handle box functionality here
      // For now, return false
      return false; 
    }

    // Not gonna be the most DRY flow control, but hopefully it'll be easy to understand

    if (this.selectedTile == null && clickedTile.player == currentPlayer && clickedTile.units.length > 0) {
      // Without prior selection clicking on a square that has units of yours

      this.selectedTile = clickedTile;
      this.unitTypeSelect = findDefaultUnitTypeSelect(clickedTile);

    } else if (this.selectedTile == null && clickedTile.player == currentPlayer && clickedTile.structure == "base") {
      // Without prior selection clicking on a square that has a base of yours

      this.selectedTile = clickedTile;

    } else if (this.selectedTile == null && clickedTile.player != currentPlayer) {
      // Without prior selection clicking a square that you do not own

      canvasContext.translate(Math.floor(canvasCenter.x - this.trueMousePosition.x), Math.floor(canvasCenter.y - this.trueMousePosition.y));
      this.offset.x += Math.floor(canvasCenter.x - this.trueMousePosition.x);
      this.offset.y += Math.floor(canvasCenter.y - this.trueMousePosition.y);

    } else if (this.selectedTile == clickedTile) {
      // Selection again the square you had already selected 

      this.selectedTile = null;

    } else if (this.unitTypeSelect && this.selectedTile != clickedTile) {
      // While having a unit type select you click another square
    
      game.move(this.selectedTile, clickedTile, this.unitTypeSelect, "one");
      this.selectedTile = null;

    } else if (this.unitTypeSelect == null && this.selectedTile) {
      // While having prior selection WITHOUT unit select you click somewhere
      // (i.e., you were slecting a city without units in it)

      this.selectedTile = null;
      
    }
  }

  this.render = function() {

    drawLeftBox();
    drawRightBox();

    if (this.selectedTile) {
      drawSquareShape("rgba(255, 255, 255, 0.8)", this.selectedTile.x, this.selectedTile.y);
    }
    if (this.hoverTile) {
      if (
        Math.floor((hand.mouseIsoPosition.x) / tileHeight) >= 0 &&
        Math.floor((hand.mouseIsoPosition.x) / tileHeight) < xSize &&
        Math.floor((hand.mouseIsoPosition.y) / tileHeight) >= 0 &&
        Math.floor((hand.mouseIsoPosition.y) / tileHeight) < ySize
      ) {
        drawSquareShape("rgba(255, 255, 255, 0.2)", this.hoverTile.x, this.hoverTile.y);
        drawTileicon();
        populateSideBarContainers();
      }
    }
  }

  function drawTileicon() {

    if (hand.selectedTile) {
      var tileiconSquare = game.globalBoard.square(hand.selectedTile.x, hand.selectedTile.y);
    } else {
      var tileiconSquare = game.globalBoard.square(hand.hoverTile.x, hand.hoverTile.y);
    }

    canvasContext.save();
    canvasContext.translate(canvasWidth / 2 - hand.offset.x - 115, 0 - hand.offset.y);
    canvasContext.scale(1.5, 1.5);
    drawSquare(tileiconSquare, 0, 0);
    canvasContext.restore();
  }

  // Does not assume that the hover square has any units
  function populateSideBarContainers() {
    var hoverSquare = game.globalBoard.square(hand.hoverTile.x, hand.hoverTile.y);
    var typesInThisSquare = unitTypeMapper(hoverSquare);
    canvasContext.save();
    canvasContext.translate(canvasWidth / 2 - hand.offset.x - (rightBoxWidth -50), 0 - hand.offset.y + 80);
    canvasContext.scale(1.5, 1.5);
    for (var i = 0; i < typesInThisSquare.length; i++) {
      drawSource(typesInThisSquare[i] + hoverSquare.player.number, 0, 0 + i * 40);
    }
    canvasContext.restore();
  }

  function drawLeftBox() {
    canvasContext.save();
    canvasContext.translate(canvasWidth / -2 - hand.offset.x, canvasHeight - leftBoxHeight - hand.offset.y);
    var pattern = canvasContext.createPattern(textureImage, "repeat");
    canvasContext.fillStyle = pattern;
    canvasContext.fillRect(0, 0, leftBoxWidth, leftBoxHeight);

    // If it's your turn
    canvasContext.font = "18px serif";
    canvasContext.fillStyle = "black"
    if (currentPlayer.isTurnPlayer) {
      canvasContext.fillText("Your Turn!", 20, 40);
    } else {
      canvasContext.fillText("Waiting for other players...", 20, 40);
    }

    // The game turn
    canvasContext.fillText("Turn: " + game.turnNumber, leftBoxWidth - 110, 40)

    // How much gold you have
    canvasContext.fillText("Gold: " + currentPlayer.gold, 20, 100);

    // How much gold you make per turn
    canvasContext.fillText("Income: " + (Math.floor(currentPlayer.numberOfFarms / farmIncome) - currentPlayer.numberOfBases), leftBoxWidth - 110, 100);

    // Number of farms
    canvasContext.fillText("Farms: " + currentPlayer.numberOfFarms, 20, 150);

    // Number of bases
    canvasContext.fillText("Bases: " + currentPlayer.numberOfBases, leftBoxWidth - 110, 150);

    canvasContext.restore();
  }

  function drawRightBox() {
    canvasContext.save();
    canvasContext.translate(canvasWidth / 2 - hand.offset.x - rightBoxWidth, 0 - hand.offset.y);
    var pattern = canvasContext.createPattern(textureImage, "repeat");
    canvasContext.fillStyle = pattern;
    canvasContext.fillRect(0, 0, rightBoxWidth, canvasHeight);
    canvasContext.restore();
  }

  // For a give square will return the unit with the highest selection priority
  // For now it'll just return the first unit's type
  function findDefaultUnitTypeSelect(square) {
    return unitTypeMapper(square)[0];
  }
}