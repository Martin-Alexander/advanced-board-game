// Returns a JSON-friendly object of game data
JSONifyGame = function() {

  var gameJSON = {};

  // Set turn number
  gameJSON.turnNumber = game.turnNumber;

  // Set players
  gameJSON.playerOne = JSONifyPlayer(game.playerOne);
  gameJSON.playerTwo = JSONifyPlayer(game.playerTwo);

  // Set global board
  gameJSON.globalBoard = JSONifyGlobalBoard(game.globalBoard);

  return gameJSON;
}

// Returns a JSON-friendly object of for a give player
JSONifyPlayer = function(player) {

  return {
    number: player.number,
    isTurnPlayer: player.isTurnPlayer,
    gold: player.gold,
    vision: JSONifyVision(player),
    numberOfFarms: player.numberOfFarms,
    numberOfBases: player.numberOfBases    
  };
}

// Returns a JSON-friendly object of for a give player's vision
JSONifyVision = function(player) {

  var visionJSON = [];

  for (var i = 0; i < player.vision.length; i++) {
    
    var visionSquare = player.vision[i];

    if (visionSquare.player == null) {
      var playerNumber = 0;
    } else {
      var playerNumber = visionSquare.player.number;
    }

    visionJSON.push({
      x: visionSquare.x,
      y: visionSquare.y,
      status: visionSquare.status,
      structure: visionSquare.structure,
      playerNumber: playerNumber
    });
  }

  return visionJSON;
}

// Returns a JSON-friendly object of the global board
JSONifyGlobalBoard = function() {

  var boardJSON = [];

  for (var i = 0; i < game.globalBoard.data.length; i++) {

    var square = game.globalBoard.data[i];

    if (square.player == null) {
      var playerNumber = 0;
    } else {
      var playerNumber = square.player.number;
    }

    boardJSON.push({
      x: square.x,
      y: square.y,
      terrain: square.terrain,
      structure: square.structure,
      playerNumber: playerNumber,
      units: JSONifyUnit(square)
    });
  }

  return boardJSON;
}

// Returns a JSON-friendly object of a unit for a given square
JSONifyUnit = function(square) {

  var unitsJSON = [];

  for (var i = 0; i < square.units.length; i++) {

    var unit = square.units[i];
    unitsJSON.push({
      type: unit.type,
      movesLeft: unit.movesLeft,
      playerNumber: unit.player.number
    });
  }

  return unitsJSON;
}

updateGameFromJSON = function(gameJSON) {

  game.turnNumber = gameJSON.turnNumber;

  updatePlayerFromJSON(game.playerOne, gameJSON.playerOne);
  updatePlayerFromJSON(game.playerTwo, gameJSON.playerTwo);

  updateGlobalBoardFromJSON(game.globalBoard.data, gameJSON.globalBoard);
}

updatePlayerFromJSON = function(player, playerJSON) {

  player.isTurnPlayer = playerJSON.isTurnPlayer;
  player.gold = playerJSON.gold;

  updateVisionFromJSON(player, playerJSON.vision);

  player.numberOfFarms = playerJSON.numberOfFarms;
  player.numberOfBases = playerJSON.numberOfBases;

}

updateVisionFromJSON = function(vision, visionJSON) {

  for (var i = 0; i < visionJSON.length; i++) {

    var visionSquareJSON = visionJSON[i];
    var visionSquare = vision[i];

    if (visionSquareJSON.playerNumber == 0) {
      var player = null;
    } else if (visionSquareJSON.playerNumber == 1) {
      var player = game.playerOne;
    } else if (visionSquareJSON.playerNumber == 2) {
      var player = game.playerTwo;
    }

    visionSquare.status = visionSquareJSON.status;
    visionSquare.structure = visionSquareJSON.structure;
    visionSquare.player = player;
  }
}

updateGlobalBoardFromJSON = function(data, globalBoard) {

  for (var i = 0; i < data.length; i++){

    var squareJSON = globalBoard[i];
    var square = data[i];

    if (squareJSON.playerNumber == 0) {
      var player = null;
    } else if (squareJSON.playerNumber == 1) {
      var player = game.playerOne;
    } else if (squareJSON.playerNumber == 2) {
      var player = game.playerTwo;
    }

    square.terrain = squareJSON.terrain;
    square.structure = squareJSON.structure;
    square.player = player;
    updateUnitsFromJSON(square.units, squareJSON.units);
  }
}

updateUnitsFromJSON = function(units, unitsJSON) {

  for (var i = 0; i < unitsJSON.length; i++){

    var unitJSON = unitsJSON[i];
    var unit = units[i];

    if (unitsJSON.playerNumber == 0) {
      var player = null;
    } else if (unitsJSON.playerNumber == 1) {
      var player = game.playerOne;
    } else if (unitsJSON.playerNumber == 2) {
      var player = game.playerTwo;
    }

    unit.type = unitJSON.type;
    unit.movesLeft = unitJSON.movesLeft;
    unit.player = player;
  }
}