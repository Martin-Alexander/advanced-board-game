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

/*

Generating a new board will be somewhat tricky. 

*/
game.generateNewBoard = function() {

  var self = this

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

  // Prune terrain
  for (var i = 0; i < 10; i++) {
    prune("mountain", 2);
  }
  for (var i = 0; i < 8; i++) {
    prune("water", 4);
  }

  // Mirror board for fairness
  for (var i = 0; i < xSize * ySize; i++) {
    
    var square = self.globalBoard.data[i];

    if (square.x - square.y > 0) {
      square.terrain = this.globalBoard.square(square.y, square.x).terrain;
    }
  }

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
