var game = {
  over: false,
  turnNumber: 0,
  playerOne: undefined,
  playerTwo: undefined,
  turnplayer: function() {
    if (this.playerOne.isTurnPlayer) {
      return this.playerOne;
    } else {
      return this.playerTwo;
    }
  }
}

// Generate a brand new board
game.generateNewBoard = function() {

  // Yeah, I don't know
  var self = this;

  // Square has at least this many neighbours
  function hasAtLeastManyNeighbours(square, critereaTerrain, minNumber) {

      var neighbours = square.neighbours();
      var numberOfMatches = 0;

      for (var j = 0; j < 8; j++) {
        if (neighbours[j] && neighbours[j].terrain == critereaTerrain) {
          numberOfMatches++;
        }
      }
      if (numberOfMatches >= minNumber) {
        return true;
      } else {
        return false;
      }
  }

  // Prune the board for jutting-out water or mountain squares
  function prune(terrain, lowest) {
    for (var i = 0; i < xSize * ySize; i++) {

      var square = self.globalBoard.data[i];

      if (square.terrain == terrain) {

        if (!(hasAtLeastManyNeighbours(square, terrain, lowest))) {
          square.terrain = "grass"
        }
      }
    }
  }

  // Fill board with squares (either grass, mountain, or water)
  function terrainify(terrain, coverage) {
    for (var i = 0; i < xSize * ySize; i++) {

      var square = self.globalBoard.data[i];

      if (
        ((square.x == 0 || square.x == xSize - 1 || square.y == 0 || square.y == ySize - 1 ) && (chance(coverage * 0.8))) ||
        chance(coverage) && 
        square.terrain == "grass"
      ) {
        square.terrain = terrain;
      } 
    }
  }

  // Empty board just in case
  this.globalBoard.empty();

  // Fill board with grass
  for (var y = 0; y < ySize; y++) {
    for (var x = 0; x < xSize; x++) {
      var newSquare = new Square(x, y);
      newSquare.player = null;
      newSquare.structure = null;
      newSquare.terrain = "grass"

      this.globalBoard.data.push(newSquare);
    }
  }

  // Add terrain
  terrainify("water", 65);
  terrainify("mountain", 90);

  // Mirror board for fairness
  for (var i = 0; i < xSize * ySize; i++) {
    
    var square = self.globalBoard.data[i];

    if (square.x - square.y > 0) {
      square.terrain = this.globalBoard.square(square.y, square.x).terrain;
    }
  }

  // Prune terrain
  for (var i = 0; i < 20; i++) {
    prune("mountain", 2);
  }
  for (var i = 0; i < 20; i++) {
    prune("water", 4);
  }  

  for (var i = 0; i < xSize * ySize; i++) {

    var square = this.globalBoard.data[i];

    if (square.terrain == "grass" || square.terrain == "mountain") {

      var neighbours = square.neighbours();
      var numberOfMatches = 0;

      for (var j = 0; j < 8; j++) {
        if (neighbours[j] && neighbours[j].terrain == "water") {
          numberOfMatches++;
        }
      }
      if (numberOfMatches > 4) {
        square.terrain = "water";
      }

    }
  }  


  // Plants initiall bases
  var complete = false;

  for (var i = 0; i < xSize * ySize; i++) {

    var square = self.globalBoard.data[i];
    if (hasAtLeastManyNeighbours(square, "grass", 8) && square.terrain == "grass" && Math.abs(square.x - square.y > xSize * 0.4) && square.x > 4 && square.y > 4) {
      
      // square.addUnit("scout", game.playerOne);
      // square.addUnit("scout", game.playerOne);
      // square.addUnit("scout", game.playerOne);

      // square.addUnit("garrison", game.playerOne);
      // square.addUnit("knight", game.playerOne);
      // square.addUnit("worker", game.playerOne);

      square.player = this.playerOne;
      square.structure = "base";

      for (var i = 0; i < 8; i++) {
        square.neighbours()[i].player = this.playerOne;
        square.neighbours()[i].structure = "farm";
      }
      this.playerOne.numberOfFarms = 8;

      this.globalBoard.square(square.y, square.x).player = this.playerTwo;
      this.globalBoard.square(square.y, square.x).structure = "base";

      for (var i = 0; i < 8; i++) {
        this.globalBoard.square(square.y, square.x).neighbours()[i].player = this.playerTwo;
        this.globalBoard.square(square.y, square.x).neighbours()[i].structure = "farm";
      }
      this.playerTwo.numberOfFarms = 8;      

      complete = true;

      break
    }
  }

  if (!complete) {
    for (var i = 0; i < xSize * ySize; i++) {
      var square = self.globalBoard.data[i];
      if (hasAtLeastManyNeighbours(square, "grass", 8) && square.terrain == "grass" && Math.abs(square.x - square.y > 4)) {

        // square.addUnit("scout", game.playerOne);
        // square.addUnit("scout", game.playerOne);
        // square.addUnit("scout", game.playerOne);

        // square.addUnit("garrison", game.playerOne);
        // square.addUnit("knight", game.playerOne);
        // square.addUnit("worker", game.playerOne);

        square.player = this.playerOne;
        square.structure = "base";

        for (var i = 0; i < 8; i++) {
          square.neighbours()[i].player = this.playerOne;
          square.neighbours()[i].structure = "farm";
        }
        this.playerOne.numberOfFarms = 8;

        this.globalBoard.square(square.y, square.x).player = this.playerTwo;
        this.globalBoard.square(square.y, square.x).structure = "base";
        
        for (var i = 0; i < 8; i++) {
          this.globalBoard.square(square.y, square.x).neighbours()[i].player = this.playerTwo;
          this.globalBoard.square(square.y, square.x).neighbours()[i].structure = "farm";
        }
        this.playerTwo.numberOfFarms = 8;

        break
      }  
    }    
  }

  var waterCounter = 0;
  for (var i = 0; i < xSize * ySize; i++) {
    if (this.globalBoard.data[i].terrain == "water") {
      waterCounter++;
    }
  }
  if (waterCounter / this.globalBoard.data.length < 0.20) {
    this.generateNewBoard();
  }

  boardHasBeenGenerated = true;
}

game.embark = function(fromSquare, toSquare, type, movesLeft) {

  if (hand.shiftDown) {
    var amount = fromSquare.exactCount(type, movesLeft);
  } else if (hand.ctrlDown && fromSquare.exactCount(type, movesLeft) > 1) {
    var amount = Math.floor(fromSquare.exactCount(type, movesLeft) / 2);
  } else {
    var amount = 1;
  }

  if (
    fromSquare.units.length > 0 &&  
    fromSquare.player.isTurnPlayer &&
    fromSquare.player == currentPlayer &&
    toSquare.terrain == "water" &&
    toSquare.player == currentPlayer &&
    toSquare.hasAnEmptyShip() &&
    areAdjacent(fromSquare, toSquare)
  ) {

  for (var i = 0; i < amount; i++) {
    if (toSquare.hasAnEmptyShip()) {
      console.log(toSquare.returnAnEmptyShip());
      console.log("hey");
      deleteUnit(fromSquare, type, 1, movesLeft);
      var newUnit = new Unit;
      newUnit.type = type;
      newUnit.movesLeft = 0;
      newUnit.player = toSquare.player;
      var ship = toSquare.returnAnEmptyShip();
      ship.embark(newUnit);
    }
  }

    return true;
  } else {
    return false;
  }

}

// Assumes movesLeft is not 0
game.disembark = function(fromSquare, toSquare, type, movesLeft) {

  if (hand.shiftDown) {
    var amount = fromSquare.exactCount(type, movesLeft);
  } else if (hand.ctrlDown && fromSquare.exactCount(type, movesLeft) > 1) {
    var amount = Math.floor(fromSquare.exactCount(type, movesLeft) / 2);
  } else {
    var amount = 1;
  }

  if (
    fromSquare.player.isTurnPlayer &&
    fromSquare.player == currentPlayer &&
    toSquare.terrain == "grass" &&
    (toSquare.player == null || toSquare.player == currentPlayer) &&
    areAdjacent(fromSquare, toSquare)
  ) {

    for (var i = 0; i < amount; i++) {
      var newUnit = new Unit;
      newUnit.type = type;
      newUnit.movesLeft = movesLeft - 1;
      newUnit.player = fromSquare.player;

      toSquare.units.push(newUnit);
      fromSquare.removeFromTransport(type, movesLeft);
    }

    toSquare.player = fromSquare.player
    return true;
  } else {
    return false;
  }

}

// Handles moving 
game.move = function(fromSquare, toSquare, type, movesLeft) {

  if (hand.shiftDown) {
    var amount = fromSquare.exactCount(type, movesLeft);
  } else if (hand.ctrlDown && fromSquare.exactCount(type, movesLeft) > 1) {
    var amount = Math.floor(fromSquare.exactCount(type, movesLeft) / 2);
  } else {
    var amount = 1;
  }

  // When/if spies are implemented this will have to change
  if (
    fromSquare.units.length > 0 &&  
    fromSquare.player.isTurnPlayer &&
    fromSquare.player == currentPlayer &&
    ((toSquare.terrain == "grass" && (type != "ship" || (toSquare.isCostal() && toSquare.structure == "base"))) || (toSquare.terrain == "water" && type == "ship")) &&
    (toSquare.player == null || toSquare.player == currentPlayer) &&
    areAdjacent(fromSquare, toSquare)
  ) {
    moveOneUnit(fromSquare, toSquare, type, amount, movesLeft);

    if (fromSquare.units.length == 0 && fromSquare.structure == null) {
      fromSquare.player = null;
    }

    // this.sendToServer();
    return true;
  } else {
    return false;
  }
}

game.fight = function(fromSquare, toSquare) {

  if (
    fromSquare.attackPower() > 0 &&
    fromSquare.player.isTurnPlayer &&
    ((fromSquare.terrain == "grass" && toSquare.terrain == "grass") ||
    (fromSquare.terrain == "water" && toSquare.terrain == "water") ||
    (fromSquare.terrain == "water" && toSquare.terrain == "grass")) &&
    areAdjacent(fromSquare, toSquare)
    ) {
    var toSquarePower = toSquare.power();
    var fromSquarePower = fromSquare.attackPower();
    var fromSquareDamage = fromSquare.damage(Math.ceil(toSquarePower / 2), true);
    var toSquareDamage = toSquare.damage(Math.ceil(fromSquarePower / 2), false);

    hand.drawDamage = {
      fromSquare: fromSquare,
      toSquare: toSquare,
      fromDamage: fromSquareDamage,
      toDamage: toSquareDamage
    }

    fromSquare.inactivateAll();

    if (fromSquare.units.length == 0 && fromSquare.structure == null) { fromSquare.player = null; }
    if (toSquare.units.length == 0 && toSquare.structure == null) { toSquare.player = null; }

    $.ajax({
      method: "POST",
      url: "/damage",
      data: {
        playerNumber: currentPlayer.number,
        fromSquare: [fromSquare.x, fromSquare.y],
        toSquare: [toSquare.x, toSquare.y],
        fromDamage: fromSquareDamage,
        toDamage: toSquareDamage
      }
    });

    return true;
  } else {
    return false;
  }
}

game.pillage = function(fromSquare, toSquare) {
  if (fromSquare.attackPower() > 0 &&
    ((fromSquare.terrain == "grass" && toSquare.terrain == "grass") ||
    (fromSquare.terrain == "water" && toSquare.terrain == "water") ||
    (fromSquare.terrain == "water" && toSquare.terrain == "grass")) &&
    areAdjacent(fromSquare, toSquare)
  ) {

    fromSquare.inactivateAll();
    if (toSquare.structure == "base") {
      toSquare.player.numberOfBases--;
      fromSquare.player.gold += pillageLootLookup.base;
      if (toSquare.player.numberOfBases == 0) { this.winner(fromSquare.player); }
    } else if (toSquare.structure == "farm") {
      toSquare.player.numberOfFarms--;
      fromSquare.player.gold += pillageLootLookup.farm;
    }

    toSquare.structure = null;

    if (fromSquare.units.length == 0 && fromSquare.structure == null) { fromSquare.player = null; }
    if (toSquare.units.length == 0 && toSquare.structure == null) { toSquare.player = null; }

    // this.sendToServer();

    return true;
  } else {
    return false;
  }
}

game.winner = function(player) {
  this.sendToServer(true);
  alert("Player " + player.number + "wins!");
}

game.updateVision = function(player) {

  if (!boardHasBeenGenerated) { return false; }

  for (var i = 0; i < xSize * ySize; i++) {

    var visionSquare = player.vision.data[i];
    var square = this.globalBoard.data[i];

    var neighbours = square.neighbours();
    var numberOfMatches = 0;

    // If it's initially black
    if (visionSquare.status == "black") {

      // If you're standing on a black square (should never happen if you think about it)
      if (square.player == currentPlayer) {
        visionSquare.status = "visible";
      } else {

        for (var j = 0; j < 8; j++) {
          if (neighbours[j] && (neighbours[j].player == currentPlayer)) {
            visionSquare.status = "visible";
            break;
          }
        }
      }

    // If it's initially fog
    } else if (visionSquare.status == "fog") {

      // If you're standing on a fog square
      if (square.player == currentPlayer) {
        visionSquare.status = "visible";
      } else {

        for (var j = 0; j < 8; j++) {
          if (neighbours[j] && (neighbours[j].player == currentPlayer)) {
            visionSquare.status = "visible";
            break;
          }
        }
      }

    } else if (visionSquare.status == "visible") {
    // This is where fogging/locking occurs. Squares are left in the state they
    // were last seen at

      for (var j = 0; j < 8; j++) {
        if (square.player != currentPlayer && (!neighbours[j] || (neighbours[j] && (neighbours[j].player != currentPlayer)))) {
          numberOfMatches++;
        }
      }

      if (numberOfMatches == 8) {
        visionSquare.status = "fog";
        visionSquare.player = square.player;
        visionSquare.structure = square.structure;
        visionSquare.terrain = square.terrain;
      }
    }
  }
}

// Updates game number, swaps turnplayer, and refreshes all units moves
game.nextTurn = function() {

  if (this.over || !currentPlayer.isTurnPlayer) { 
    return false; 
  }

  game.turnNumber++;
  game.playerOne.isTurnPlayer = !game.playerOne.isTurnPlayer;
  game.playerTwo.isTurnPlayer = !game.playerTwo.isTurnPlayer;

  for (var i = 0; i < xSize * ySize; i++) {
    for (var j = 0; j < game.globalBoard.data[i].allUnitsIncludingTransport().length; j++) {
      game.globalBoard.data[i].allUnitsIncludingTransport()[j].movesLeft = movesLeftLookup[game.globalBoard.data[i].allUnitsIncludingTransport()[j].type];
    }
  }

  hand.selectedTile = null;

  this.turnplayer().gold += Math.floor(this.turnplayer().numberOfFarms / 4) - this.turnplayer().numberOfBases;

  this.sendToServer();
}

game.sendToServer = function(over = false) {

  if (!boardHasBeenGenerated || this.over) { return false; }

  if (over) { this.over = true; }

  $.ajax({
    method: "POST",
    url: "/input",
    data: {
      game: JSON.stringify(JSONifyGame()),
      playerNumber: currentPlayer.number
    },
    success: function() {
      if (over) {
        $.ajax({
          method: "POST",
          url: "/game_over",
          data: {
            game: JSON.stringify(JSONifyGame())
          }
        });  
      }
    }
  });

}

game.train = function(type, location) {
  if (currentPlayer.gold >= unitCostLookup[type] &&
    (location.unitsProduced == undefined || location.unitsProduced < productionPerTurn)) {
    currentPlayer.gold -= unitCostLookup[type];

    location.addUnit(type, currentPlayer);
    if (location.unitsProduced) {
      location.unitsProduced++;
    } else {
      location.unitsProduced = 1;
    }
    // this.sendToServer();
    return true;
  } else {
    return false;
  }
}

game.build = function(struction, location) {
  if (game.turnplayer() == currentPlayer  && location.player == currentPlayer && location.structure == null && location.count("worker", 1)) {
    deleteUnit(location, "worker", 1, hand.moveLeftSelect);
    location.structure = struction
    if (struction == "farm") {
      currentPlayer.numberOfFarms++;
    } else if (struction == "base") {
      currentPlayer.numberOfBases++;
    }
    // this.sendToServer();
    return true;
  } else {
    return false;
  }
}

game.anEmptyBoard = function() {

  for (var y = 0; y < ySize; y++) {
    for (var x = 0; x < xSize; x++) {
      
    var newSquare = new Square(x, y);

    this.globalBoard.data.push(newSquare);
    }
  }
}

// Temporary for testing purposes
window.addEventListener("keyup", function(e) {
  if (e.keyCode == 13) {
    game.nextTurn();
  }
});