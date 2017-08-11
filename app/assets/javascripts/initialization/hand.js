function Hand() {

  // Simple coordinate objects (x, y)
  this.mousePosition = {};
  this.mouseIsoPosition = {};
  this.trueMousePosition = {};

  // Square objects (potentially VisionSquare objects)
  this.hoverTile;
  this.selectedTile = null;

  var clickedTile;
  var canvasCenter = { x: canvasWidth / 2 - rightBoxWidth / 2, y: canvasHeight / 2 };
  var beginningOfUnitList = 270;
  
  this.offset = { x: 0, y: 0 };

  this.unitTypeSelect = null;
  this.moveLeftSelect = null;
  this.transportSelect = 0;
  this.moveLeftSelectPointer = 0;

  this.inherentPriority = ["ship", "knight", "scout", "worker", "garrison"];
  this.savedSquare = null;

  this.trainTab = false;
  this.trainTabOpenned = false;

  this.drawDamage = false;
  this.drawDamageCounter = 20;

  this.shiftDown = false;
  this.ctrlDown = false;

  this.click = function() {

    // Warning, basing hand logic on the global board might give a player 
    // information from outside thier line of sight. Should eventually be 
    // changed to the player board
    if (this.hoverTile) {
      clickedTile = game.globalBoard.square(this.hoverTile.x, this.hoverTile.y);
    } else {
      clickedTile = null;
    }

    if (game.over) { this.selectedTile = null; }

    // Clicked outside of board bounds?
    // if (!clickedTile) { return false; }

    // Are you clicking a box?
    if (this.trueMousePosition.x > canvasWidth - rightBoxWidth || (this.trueMousePosition.y > canvasHeight - leftBoxHeight && this.trueMousePosition.x < leftBoxWidth)) { 
      
      if (game.over) { return false; }

      // If you clicked on a sidebar container
      if (currentPlayer.isTurnPlayer && this.trueMousePosition.x > canvasWidth - rightBoxWidth + 10 && this.trueMousePosition.x < canvasWidth - 10 && this.trueMousePosition.y > beginningOfUnitList && this.selectedTile) {
        if (this.trainTabOpenned == false) {
          var rowClickedOn = Math.floor((this.trueMousePosition.y - beginningOfUnitList) / 75);
          this.unitTypeSelect = unitTypeMapper(this.selectedTile)[rowClickedOn];
          this.savedSquare = this.selectedTile;
          refreshInherentPriority();
          this.inherentPriority.splice(0, 0, this.unitTypeSelect);
          setMovesLeftSelect(this.selectedTile);
        } else {
          if (this.selectedTile.isCostal()) {
            var units = displayPriority.costal;
          } else {
            var units = displayPriority.landLocked;
          }
          var rowClickedOn = Math.floor((this.trueMousePosition.y - beginningOfUnitList) / 75);
          if (game.train(units[rowClickedOn], this.selectedTile)) {
            this.savedSquare = this.selectedTile;
            this.unitTypeSelect = units[rowClickedOn];
            refreshInherentPriority();
            this.inherentPriority.splice(0, 0, this.unitTypeSelect);
            setMovesLeftSelect(this.selectedTile);
          }
        }
      }

      // If you clicked on a sidebar tab
      if (this.trainTab && this.trueMousePosition.x < canvasWidth - 10 && this.trueMousePosition.x > canvasWidth - (rightBoxWidth / 2 + 10) && this.trueMousePosition.y > 230 && this.trueMousePosition.y < beginningOfUnitList) {
        this.trainTabOpenned = true;
      } else if (this.trueMousePosition.x < canvasWidth - (rightBoxWidth / 2 + 10) && this.trueMousePosition.x > canvasWidth - rightBoxWidth - 10 && this.trueMousePosition.y > 230 && this.trueMousePosition.y < beginningOfUnitList) {
        this.trainTabOpenned = false;
      }

      return false; 
    }

    // Not gonna be the most DRY flow control, but hopefully it'll be easy to understand

    if (this.selectedTile == null && clickedTile && clickedTile.player == currentPlayer && clickedTile.units.length > 0 && !game.over) {
      // Without prior selection clicking on a square that has units of yours

      this.selectedTile = clickedTile;

      setUnitTypeSelect(this.selectedTile);
      
      if (this.savedSquare == null && this.unitTypeSelect) {
        this.savedSquare = this.selectedTile;
        this.inherentPriority.splice(0, 0, this.unitTypeSelect);
      } else if (this.selectedTile != this.savedSquare) {
        refreshInherentPriority();
      }

      setMovesLeftSelect(this.selectedTile);

    } else if (this.selectedTile == null && clickedTile && clickedTile.player == currentPlayer && clickedTile.structure == "base" && !game.over) {
      // Without prior selection clicking on a square that has a base of yours

      // Only fires when base is empty!

      this.selectedTile = clickedTile;

    } else if (this.selectedTile == null && clickedTile && (clickedTile.player != currentPlayer || clickedTile.structure == "farm") && clickedTile) {
      // Without prior selection clicking a square that you do not own

      canvasContext.translate(Math.floor(canvasCenter.x - this.trueMousePosition.x), Math.floor(canvasCenter.y - this.trueMousePosition.y));
      this.offset.x += Math.floor(canvasCenter.x - this.trueMousePosition.x);
      this.offset.y += Math.floor(canvasCenter.y - this.trueMousePosition.y);

    } else if (this.selectedTile == clickedTile) {
      // Selection again the square you had already selected 

      this.selectedTile = null;
      this.unitTypeSelect = null;
      this.moveLeftSelectPointer = 0;

    } else if (clickedTile && this.unitTypeSelect && this.selectedTile != clickedTile) {
      // While having a unit type select you click another square
    
      if (clickedTile.player && clickedTile.player != currentPlayer && clickedTile.units.length > 0) {
        // Fight
        if (game.fight(this.selectedTile, clickedTile)) {

          this.selectedTile = null;
          this.unitTypeSelect = null;
        }
      } else if (clickedTile.player && clickedTile.player != currentPlayer && clickedTile.units.length == 0 && clickedTile.structure) {
        // Pillage
        if (game.pillage(this.selectedTile, clickedTile)) {

          this.selectedTile = null;
          this.unitTypeSelect = null; 
        }
      } else if (clickedTile && this.selectedTile.terrain == "grass" && clickedTile.terrain == "water" && this.unitTypeSelect != "ship") {
        // Embarking

        game.embark(this.selectedTile, clickedTile, this.unitTypeSelect, this.moveLeftSelect);

        this.selectedTile = null;
        this.unitTypeSelect = null;

      } else if (clickedTile && clickedTile.terrain == "grass" && this.selectedTile.terrain == "water" && this.unitTypeSelect != "ship") {

        if (game.disembark(this.selectedTile, clickedTile, this.unitTypeSelect, this.moveLeftSelect)) {

          this.selectedTile = clickedTile;
          this.moveLeftSelect -= 1;
        } else {
          this.selectedTile = null;
          this.unitTypeSelect = null; 
        }


      } else {
        // Regular Move

        if (this.moveLeftSelect > 1) {

          if (game.move(this.selectedTile, clickedTile, this.unitTypeSelect, this.moveLeftSelect)) {
            this.moveLeftSelect--;
            this.selectedTile = clickedTile;
          } else {
            this.selectedTile = null;
            this.unitTypeSelect = null;            
          }

        } else {

          game.move(this.selectedTile, clickedTile, this.unitTypeSelect, this.moveLeftSelect)

          this.selectedTile = null;
          this.unitTypeSelect = null;
        }
      }

      this.moveLeftSelectPointer = 0;

    } else if (this.unitTypeSelect == null && this.selectedTile) {
      // While having prior selection WITHOUT unit select you click somewhere
      // (i.e., you were slecting a city without units in it)

      this.selectedTile = null;
      
    }

    // After all the click logic, if you're still selecting a tile that contains
    // a city of yours then the train tab is rendered, otherwise it's removed
    if (this.selectedTile && this.selectedTile.player == currentPlayer && this.selectedTile.structure == "base") {

      this.trainTab = true;
    } else {

      this.trainTab = false;
      this.trainTabOpenned = false;
    }
  }

  this.tab = function() {
    this.moveLeftSelectPointer++;
    this.moveLeftSelectPointer = this.moveLeftSelectPointer % this.selectedTile.listOfMovesLeft(this.unitTypeSelect).length;
    setMovesLeftSelect(this.selectedTile);
  }

  this.render = function() {

    drawLeftBox();
    drawRightBox();

    if (this.selectedTile) {
      drawSelectedUnit();
    }
    if (this.selectedTile || this.hoverTile) {
      drawTileicon();
      if (!this.trainTabOpenned) {
        populateSideBarContainers();
      } else {
        drawTrainableUnitList()
      }
    }

    if (this.trainTab) {
      drawTrainTabButton();
    }

    if (this.drawDamage) {

        var fromSquare = this.drawDamage.fromSquare;
        var toSquare = this.drawDamage.toSquare;
        var fromDamage = this.drawDamage.fromDamage;
        var toDamage = this.drawDamage.toDamage;

        canvasContext.save();
        canvasContext.translate((fromSquare.x - fromSquare.y) * (tileWidth / 2 + 0), (fromSquare.x + fromSquare.y) * (tileHeight / 2));
        canvasContext.font = "18px sans-serif";
        canvasContext.fillStyle = 'red';
        canvasContext.fillText(0 - fromDamage, -10, 0);   
        canvasContext.restore();

        canvasContext.save();
        canvasContext.translate((toSquare.x - toSquare.y) * (tileWidth / 2 + 0), (toSquare.x + toSquare.y) * (tileHeight / 2));
        canvasContext.font = "18px sans-serif";
        canvasContext.fillStyle = 'red';
        canvasContext.fillText(0 - toDamage, -10, 0);   
        canvasContext.restore();

        this.drawDamageCounter--;

        if (this.drawDamageCounter == 0) {
          this.drawDamage = false;
          this.drawDamageCounter = 20;
        }
    }
  }

  this.build = function(structure) {
    if (this.selectedTile) {
      if (game.build(structure, this.selectedTile)) {
        this.selectedTile = null;
        this.unitTypeSelect = null;
        this.moveLeftSelect = null;
        this.moveLeftSelectPointer = 0;
      }
    }
  }

  function drawTrainableUnitList() {

    if (hand.selectedTile && hand.selectedTile.isCostal()) {
      var units = displayPriority.costal;
    } else {
      var units = displayPriority.landLocked;
    }

    canvasContext.save();
    canvasContext.translate(canvasWidth / 2 - hand.offset.x - (rightBoxWidth - 10), 0 - hand.offset.y + beginningOfUnitList);
    canvasContext.scale(1.5, 1.5);
    for (var i = 0; i < units.length; i++) {
      drawSource(units[i] + currentPlayer.number, 0, 0 + i * 50);
    }
    canvasContext.restore();

    canvasContext.save();
    canvasContext.translate(canvasWidth / 2 - hand.offset.x - (rightBoxWidth - 15), 0 - hand.offset.y + beginningOfUnitList);
    for (var i = 0; i < units.length; i++) {
      canvasContext.font = "18px serif";
      canvasContext.fillStyle = "black"
      canvasContext.fillText(capitalize(units[i]), 80, 25 + i * 75);
      canvasContext.font = "14px serif";
      canvasContext.fillText("Movement: " + movesLeftLookup[units[i]], 80, 45 + i * 75);
      canvasContext.fillText("Strength: " + powerLookup[units[i]], 80, 65 + i * 75);
    }
    canvasContext.restore();    
  }

  function drawTrainTabButton() {
    var padding = 37;
    canvasContext.save();
    canvasContext.translate(canvasWidth / 2 - hand.offset.x - (rightBoxWidth - 10), 0 - hand.offset.y + 255);
    canvasContext.font = "17px serif";
    canvasContext.fillStyle = "black";
    canvasContext.fillText("Train", (rightBoxWidth - 20) / 2 + padding, -4);
    canvasContext.fillText("Units", 0 + padding, -4);

    if (hand.trainTabOpenned) {
      canvasContext.fillStyle = "rgba(0, 0, 0, 0.2)";
      canvasContext.fillRect(0, -25, rightBoxWidth / 2 - 10, 30);
    } else {
      canvasContext.fillStyle = "rgba(0, 0, 0, 0.2)";
      canvasContext.fillRect((rightBoxWidth - 20) / 2, -25, rightBoxWidth / 2 - 10, 30);
    }
    canvasContext.restore();
  }

  function drawSelectedUnit() {
    if (hand.unitTypeSelect) {
      canvasContext.save();
      canvasContext.translate(canvasWidth / 2 - hand.offset.x - (rightBoxWidth - 15), 0 - hand.offset.y + 130);
      canvasContext.scale(1.5, 1.5);
      drawSource(hand.unitTypeSelect + currentPlayer.number, 0, 0);
      canvasContext.restore();

      canvasContext.save();
      canvasContext.translate(canvasWidth / 2 - hand.offset.x - (rightBoxWidth - 50), 0 - hand.offset.y + 130);
      canvasContext.font = "17px serif";
      canvasContext.fillStyle = "black";
      canvasContext.fillText("Selected: " + hand.selectedTile.exactCount(hand.unitTypeSelect, hand.moveLeftSelect), 48, 25);
      canvasContext.fillText("Moves left: " + hand.moveLeftSelect + "/" + movesLeftLookup[hand.unitTypeSelect], 48, 50);
      canvasContext.restore();
    }
  }

  function drawTileicon() {

    // if (hand.selectedTile) {
    //   var tileiconVisionSquare = currentPlayer.vision.square(hand.selectedTile.x, hand.selectedTile.y);
    //   var tileiconSquare = game.globalBoard.square(hand.selectedTile.x, hand.selectedTile.y);
    // } else {
    //   var tileiconVisionSquare = currentPlayer.vision.square(hand.hoverTile.x, hand.hoverTile.y);
    //   var tileiconSquare = game.globalBoard.square(hand.hoverTile.x, hand.hoverTile.y);
    // }

    if (hand.selectedTile && hand.selectedTile.structure == "base") {
      var tileiconVisionSquare = currentPlayer.vision.square(hand.selectedTile.x, hand.selectedTile.y);
      var tileiconSquare = game.globalBoard.square(hand.selectedTile.x, hand.selectedTile.y);
    } else if (hand.hoverTile) {
      var tileiconVisionSquare = currentPlayer.vision.square(hand.hoverTile.x, hand.hoverTile.y);
      var tileiconSquare = game.globalBoard.square(hand.hoverTile.x, hand.hoverTile.y);
    } else {
      return false;
    }

    canvasContext.save();
    canvasContext.translate(canvasWidth / 2 - hand.offset.x - 120, 0 - hand.offset.y + 18);
    canvasContext.scale(1.5, 1.5);

    if (!game.over && tileiconVisionSquare.status == "black") {
      drawSource("black", 0, 0);
    } else {
      if (!game.over && tileiconVisionSquare.status == "fog") {
        var foggy = true;
      } else {
        var foggy = false;
      }

      var toDraw = findImagesSources(tileiconSquare, foggy);
      for (var i = 0; i < toDraw.length; i++) {
        drawSource(toDraw[i], 0, 0);
      }
    }
    canvasContext.restore();
  }

  // Does not assume that the hover square has any units
  function populateSideBarContainers() {
    // if (hand.selectedTile) {
    //   var hoverSquare = game.globalBoard.square(hand.selectedTile.x, hand.selectedTile.y);
    // } else {
      // var hoverSquare = game.globalBoard.square(hand.hoverTile.x, hand.hoverTile.y);
    // }
    if (hand.hoverTile && game.globalBoard.square(hand.hoverTile.x, hand.hoverTile.y) && game.globalBoard.square(hand.hoverTile.x, hand.hoverTile.y).units.length > 0) {
      var hoverSquare = game.globalBoard.square(hand.hoverTile.x, hand.hoverTile.y);
    } else if (hand.selectedTile) {
      var hoverSquare = game.globalBoard.square(hand.selectedTile.x, hand.selectedTile.y);
    } else {
      return false;
    }

    if (currentPlayer.vision.square(hoverSquare.x, hoverSquare.y).status != "visible") { return false; }
    var typesInThisSquare = unitTypeMapper(hoverSquare);
    canvasContext.save();
    canvasContext.translate(canvasWidth / 2 - hand.offset.x - (rightBoxWidth - 10), 0 - hand.offset.y + beginningOfUnitList);
    canvasContext.scale(1.5, 1.5);
    for (var i = 0; i < typesInThisSquare.length; i++) {
      drawSource(typesInThisSquare[i] + hoverSquare.player.number, 0, 0 + i * 50);
    }
    canvasContext.restore();

    canvasContext.save();
    canvasContext.translate(canvasWidth / 2 - hand.offset.x - (rightBoxWidth - 15), 0 - hand.offset.y + beginningOfUnitList);
    for (var i = 0; i < typesInThisSquare.length; i++) {
      canvasContext.font = "18px serif";
      canvasContext.fillStyle = "black"
      canvasContext.fillText(capitalize(typesInThisSquare[i]), 80, 25 + i * 75);
      canvasContext.font = "16px serif";
      canvasContext.fillText("Total: " + hoverSquare.count(typesInThisSquare[i], 0), 80, 45 + i * 75);
      if (hoverSquare.player == currentPlayer) {
        canvasContext.font = "12px serif";
        canvasContext.fillText("Ready: " + hoverSquare.count(typesInThisSquare[i], 1), 80, 65 + i * 75);
      }
    }
    canvasContext.restore();
  }

  function drawLeftBox() {
    canvasContext.save();
    canvasContext.translate(canvasWidth / -2 - hand.offset.x, canvasHeight - leftBoxHeight - hand.offset.y);
    var pattern = canvasContext.createPattern(textureImage, "repeat");
    var pattern2 = canvasContext.createPattern(textureImage2, "repeat");
    canvasContext.fillStyle = pattern2;
    canvasContext.fillRect(0, 0, leftBoxWidth, leftBoxHeight);
    canvasContext.fillStyle = pattern;
    canvasContext.fillRect(10, 10, leftBoxWidth - 20, leftBoxHeight - 20);

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
    var pattern2 = canvasContext.createPattern(textureImage2, "repeat");
    canvasContext.fillStyle = pattern2;
    canvasContext.fillRect(0, 0, rightBoxWidth, canvasHeight);
    canvasContext.fillStyle = pattern;
    canvasContext.fillRect(10, 10, rightBoxWidth - 20, 100);
    canvasContext.fillRect(10, 120, rightBoxWidth - 20, 100);
    canvasContext.fillRect(10, 230, rightBoxWidth - 20, canvasHeight - 240);
    canvasContext.restore();
  }

  // For a give square will return the unit with the highest selection priority
  // unless it's a garrison
  function setUnitTypeSelect(square) {

    var units = square.allUnitsIncludingTransport();
    var found = false;
    for (var i = 0; i < hand.inherentPriority.length; i++) {
      for (var j = 0; j < units.length; j++) {
        if (found) { break; }
        if (units[j].type == hand.inherentPriority[i] && units[j].movesLeft > 0) {
          hand.unitTypeSelect = units[j].type;
          found = true;
          break
        }
      }
    }

    if (!found) {
      hand.unitTypeSelect = unitTypeMapper(square)[0];
    }
  }

  // For a give square and your current type selection priority it will set you
  // movesLeft selector
  function setMovesLeftSelect(square) {
    
    hand.moveLeftSelect = square.listOfMovesLeft(hand.unitTypeSelect)[hand.moveLeftSelectPointer];
  }

  function refreshInherentPriority() {
    var truePriority = ["ship", "knight", "scout", "worker", "garrison"];
    hand.inherentPriority = [];

    for (var i = 0; i < truePriority.length; i++) {
      hand.inherentPriority.push(truePriority[i]);
    }
  }
}