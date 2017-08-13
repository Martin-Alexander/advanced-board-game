var typeCode = {
  scout: 's',
  knight: 'k',
  garrison: 'g',
  worker: 'w',
  ship: 'h'
}

var typeDecode = {
  s: "scout",
  k: "knight",
  g: "garrison",
  w: "worker",
  h: "ship"
}

var terrainCode = {
  grass: 'g',
  mountain: 'm',
  water: 'w'
}

var terrainDecode = {
  g: "grass", 
  m: "mountain",
  w: "water"
}

var statusCode = {
  visible: 'v',
  black: 'b',
  fog: 'f'
}

var statusDecode = {
  v: "visible",
  b: "black",
  f: "fog"
}

var structureCode = {
  null: 'n',
  farm: 'f',
  base: 'b'
}

var structureDecode = {
  n: null,
  f: "farm",
  b: "base"
}

// Returns a JSON-friendly object of game data
JSONifyGame = function() {

  var gameJSON = {};

  // Set turn number
  gameJSON.t = game.turnNumber;

  // Game over?
  gameJSON.o = game.over;  

  // Set players
  gameJSON.p1 = JSONifyPlayer(game.playerOne);
  gameJSON.p2 = JSONifyPlayer(game.playerTwo);

  // Set global board
  gameJSON.g = JSONifyGlobalBoard(game.globalBoard);

  return gameJSON;
}

// Returns a JSON-friendly object of for a give player
JSONifyPlayer = function(player) {

  return {
    n: player.number,
    t: player.isTurnPlayer,
    g: player.gold,
    v: JSONifyVision(player),
    f: player.numberOfFarms,
    b: player.numberOfBases    
  };
}

// Returns a JSON-friendly object of for a give player's vision
JSONifyVision = function(player) {

  var visionJSON = [];

  for (var i = 0; i < player.vision.data.length; i++) {
    
    var visionSquare = player.vision.data[i];

    if (visionSquare.player == null) {
      var playerNumber = 0;
    } else {
      var playerNumber = visionSquare.player.number;
    }

    visionJSON.push({
      x: visionSquare.x,
      y: visionSquare.y,
      s: statusCode[visionSquare.status],
      r: structureCode[visionSquare.structure],
      t: terrainCode[visionSquare.terrain],
      p: playerNumber
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
      t: terrainCode[square.terrain],
      s: structureCode[square.structure],
      p: playerNumber,
      u: JSONifyUnit(square)
    });
  }

  return boardJSON;
}

// Returns a JSON-friendly object of a unit for a given square
JSONifyUnit = function(square) {

  var unitsJSON = [];

  for (var i = 0; i < square.units.length; i++) {

    var unit = square.units[i];

    if (unit.type == "ship") {
      unitsJSON.push({
        t: typeCode[unit.type],
        m: unit.movesLeft,
        p: unit.player.number,
        r: JSONifyTranspost(unit.transport)
      });
    } else {
      unitsJSON.push({
        t: typeCode[unit.type],
        m: unit.movesLeft,
        p: unit.player.number
      });
    }
  }

  return unitsJSON;
}

JSONifyTranspost = function(transport) {
  var transportOutput = [];

  for (var i = 0; i < transport.length; i++) {
    transportOutput.push({
      t: typeCode[transport[i].type],
      m: transport[i].movesLeft,
      p: transport[i].player.number
    });
  }

  return transportOutput;
}

updateGameFromJSON = function(gameJSON) {

  game.turnNumber = gameJSON.t;
  game.over = gameJSON.o;

  updatePlayerFromJSON(game.playerOne, gameJSON.p1);
  updatePlayerFromJSON(game.playerTwo, gameJSON.p2);

  updateGlobalBoardFromJSON(game.globalBoard.data, gameJSON.g);
}

updatePlayerFromJSON = function(player, playerJSON) {

  player.isTurnPlayer = playerJSON.t;
  player.gold = playerJSON.g;

  updateVisionFromJSON(player.vision.data, playerJSON.v);

  player.numberOfFarms = playerJSON.f;
  player.numberOfBases = playerJSON.b;

}

updateVisionFromJSON = function(vision, visionJSON) {

  for (var i = 0; i < visionJSON.length; i++) {

    var visionSquareJSON = visionJSON[i];
    var visionSquare = vision[i];

    if (visionSquareJSON.p == 0) {
      var player = null;
    } else if (visionSquareJSON.p == 1) {
      var player = game.playerOne;
    } else if (visionSquareJSON.p == 2) {
      var player = game.playerTwo;
    }

    visionSquare.status = statusDecode[visionSquareJSON.s];
    visionSquare.structure = structureDecode[visionSquareJSON.r];
    visionSquare.terrain = terrainDecode[visionSquareJSON.t];
    visionSquare.player = player;
  }
}

updateGlobalBoardFromJSON = function(data, globalBoard) {

  for (var i = 0; i < data.length; i++){

    var squareJSON = globalBoard[i];
    var square = data[i];

    if (squareJSON.p == 0) {
      var player = null;
    } else if (squareJSON.p == 1) {
      var player = game.playerOne;
    } else if (squareJSON.p == 2) {
      var player = game.playerTwo;
    }

    square.terrain = terrainDecode[squareJSON.t];
    square.structure = structureDecode[squareJSON.s];
    square.player = player;
    updateUnitsFromJSON(square, squareJSON.u);
  }
}

updateUnitsFromJSON = function(square, unitsJSON) {

  square.units = [];

  for (var i = 0; i < unitsJSON.length; i++){

    var unitJSON = unitsJSON[i];

    if (unitJSON.p == 0) {
      var player = null;
    } else if (unitJSON.p == 1) {
      var player = game.playerOne;
    } else if (unitJSON.p == 2) {
      var player = game.playerTwo;
    }

    if (typeDecode[unitJSON.t] == "ship") {
      newUnit = new Unit;
      newUnit.type = typeDecode[unitJSON.t];
      newUnit.movesLeft = unitJSON.m;
      newUnit.player = player;
      newUnit.transport = updateTransportFromJSON(unitJSON.r, player);
    } else { 
      newUnit = new Unit;
      newUnit.type = typeDecode[unitJSON.t];
      newUnit.movesLeft = unitJSON.m;
      newUnit.player = player;
    }

    square.units.push(newUnit);
  }
}

updateTransportFromJSON = function(transportJSON, player) {

  var output = [];

  for (var i = 0; i < transportJSON.length; i++) {
    var newUnit = new Unit;
    newUnit.type = typeDecode[transportJSON[i].t];
    newUnit.movesLeft = transportJSON[i].m;
    newUnit.player = player;

    output.push(newUnit);
  }

  return output;
}