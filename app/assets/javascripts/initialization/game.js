var game = {
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
      newSquare.board = this.globalBoard;
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
    if (hasAtLeastManyNeighbours(square, "grass", 8) && square.terrain == "grass" && Math.abs(square.x - square.y > 12) && square.x > 4 && square.y > 4) {
      
      square.addUnit("scout", game.playerOne);
      square.addUnit("scout", game.playerOne);
      square.addUnit("scout", game.playerOne);

      square.addUnit("garrison", game.playerOne);
      square.addUnit("knight", game.playerOne);
      square.addUnit("worker", game.playerOne);

      square.player = this.playerOne;
      square.structure = "base";

      this.globalBoard.square(square.y, square.x).player = this.playerTwo;
      this.globalBoard.square(square.y, square.x).structure = "base";

      complete = true;

      break
    }
  }

  if (!complete) {
    for (var i = 0; i < xSize * ySize; i++) {
      var square = self.globalBoard.data[i];
      if (hasAtLeastManyNeighbours(square, "grass", 8) && square.terrain == "grass" && Math.abs(square.x - square.y > 8)) {
        square.player = this.playerOne;
        square.structure = "base";

        this.globalBoard.square(square.y, square.x).player = this.playerTwo;
        this.globalBoard.square(square.y, square.x).structure = "base";

        break
      }  
    }    
  }
}

// A temporary move function for fog of war testing
game.move = function(fromSquare, toSquare, type, amount, movesLeft) {

  // When/if spies are implemented this will have to change
  if (
    fromSquare.units.length > 0 &&  
    fromSquare.player.isTurnPlayer &&
    fromSquare.player == currentPlayer &&
    toSquare.terrain == "grass" &&
    (toSquare.player == null || toSquare.player == currentPlayer) &&
    areAdjacent(fromSquare, toSquare)
  ) {
    moveOneUnit(fromSquare, toSquare, type, amount, movesLeft);

    if (fromSquare.units.length == 0 && fromSquare.structure == null) {
      fromSquare.player = null;
    }

    return true;
  } else {
    return false;
  }
}

game.updateVision = function(player) {
  for (var i = 0; i < xSize * ySize; i++) {

    var visionSquare = player.vision.data[i];
    var square = this.globalBoard.data[i];

    var neighbours = square.neighbours();
    var numberOfMatches = 0;

    if (visionSquare.status == "black") {

      if (square.player == currentPlayer) {
        visionSquare.status = "visible";
      } else {

        for (var j = 0; j < 8; j++) {
          if (neighbours[j] && (neighbours[j].player == currentPlayer)) {
            visionSquare.status = "visible";
            break;
          } else {
            visionSquare.status = "black";
          }
        }
      }

    } else if (visionSquare.status == "visible" || visionSquare.status == "fog") {

      if (square.player == currentPlayer) {
        visionSquare.status = "visible";
      } else {

        for (var j = 0; j < 8; j++) {
          if (neighbours[j] && (neighbours[j].player == currentPlayer)) {
            visionSquare.status = "visible";
            break;
          } else {
            visionSquare.status = "fog";
          }
        }
      }

    }
  }
}

// Updates game number, swaps turnplayer, and refreshes all units moves
game.nextTurn = function() {
  game.turnNumber++;
  game.playerOne.isTurnPlayer = !game.playerOne.isTurnPlayer;
  game.playerTwo.isTurnPlayer = !game.playerTwo.isTurnPlayer;

  for (var i = 0; i < xSize * ySize; i++) {
    for (var j = 0; j < game.globalBoard.data[i].units.length; j++) {
      if (game.globalBoard.data[i].units[j].type == "scout") {
        game.globalBoard.data[i].units[j].movesLeft = scoutMoves;
      } else if (game.globalBoard.data[i].units[j].type == "garrison") {
        game.globalBoard.data[i].units[j].movesLeft = garrisonMoves;
      } else {
        game.globalBoard.data[i].units[j].movesLeft = knightMoves;
      }
    }
  }
}

// Temporary for testing purposes
window.addEventListener("keyup", function(e) {
  if (e.keyCode == 13) {
    game.nextTurn();
  }
});