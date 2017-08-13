function Square(x, y) {
  this.x = x;
  this.y = y;
  this.terrain;   // "grass", "mountain", "water"
  this.structure; // null, "farm", "base"
  this.player;    // A player object or null
  this.units = [];
}

function VisionSquare(x, y) {
  this.x = x;
  this.y = y;
  this.status;    // "black", "fog", "visible"
  this.structure;
  this.player;
  this.terrain;
}

// Returns an array of adjacent squares (in the case of the edge of the board
// false is return)
function neighbours() {

  var output = [];

  var relativePosition = [
    [-1, 1], [0, 1], [1, 1],
    [-1, 0], [1, 0],
    [-1, -1], [0, -1], [1, -1]
  ]

  for (var i = 0; i < 8; i++) {
    var coords = relativePosition[i];
    if (
      this.x + coords[0] >= xSize ||
      this.x + coords[0] < 0 ||
      this.y + coords[1] >= ySize ||
      this.y +coords[1] < 0
    ) {
      output.push(false);
    } else {
      output.push(game.globalBoard.square(this.x + coords[0], this.y + coords[1]));
    }
  }

  return output;
}

function visionNeighbours() {

  var output = [];

  var relativePosition = [
    [-1, 1], [0, 1], [1, 1],
    [-1, 0], [1, 0],
    [-1, -1], [0, -1], [1, -1]
  ]

  for (var i = 0; i < 8; i++) {
    var coords = relativePosition[i];
    if (
      this.x + coords[0] >= xSize ||
      this.x + coords[0] < 0 ||
      this.y + coords[1] >= ySize ||
      this.y +coords[1] < 0
    ) {
      output.push(false);
    } else {
      output.push(currentPlayer.vision.square(this.x + coords[0], this.y + coords[1]));
    }
  }

  return output;
}


function addUnit(type, player) {
  var newUnit = new Unit;
  newUnit.type = type;
  if (type == "ship") { newUnit.transport = []; }
  newUnit.player = player;
  newUnit.movesLeft = movesLeftLookup[type];

  this.units.push(newUnit);
  this.player = player;
}

// The number of units in a square of a given type with at least this many moves left
function count(type, movesLeft = false) {
  var counter = 0;
  var units = this.allUnitsIncludingTransport();

    for (var i = 0; i < units.length; i++) {
      if (units[i].type == type && units[i].movesLeft >= movesLeft) {
        counter++;
      }
    }

  return counter;
}

// The number of units in a square of a given type with exactly this many moves left
function exactCount(type, movesLeft) {
  var counter = 0;
  var units = this.allUnitsIncludingTransport();

    for (var i = 0; i < units.length; i++) {
      if (units[i].type == type && units[i].movesLeft == movesLeft) {
        counter++;
      }
    }

  return counter;
}

// Returns an array of all different moves left withing a given square for a 
// given unit type
// WARNING: assumes that no unit will have movesLeft of over 10
function listOfMovesLeft(type) {
  var output = [];
  var units = this.allUnitsIncludingTransport();

  for (var i = 0; i < units.length; i++) {
    if (!elementIsInArray(units[i].movesLeft, output) && units[i].type == type) {
      output.push(units[i].movesLeft);
    }
  }

  return output.sort().reverse();
}

// Returns whether or not a base has a water tile next to it
function isCostal() {
  var squaresNeighbours = this.neighbours();
  for (var i = 0; i < 8; i++) {
    if (squaresNeighbours[i].terrain == "water") { return true; }
  }
  return false;
}

function inactivateAll() {
  for (var i = 0; i < this.units.length; i++) {
    this.units[i].movesLeft = 0;
  }
}

// Returns the total power of a square
function attackPower() {

  var counter = 0;
  for (var i = 0; i < this.units.length; i++) {
    if (this.units[i].movesLeft > 0) {
      counter += powerLookup[this.units[i].type] * randomSample(damageDistribution);
    }
  }

  return counter;  
}

function power() {

  var counter = 0;
  for (var i = 0; i < this.units.length; i++) {
    counter += powerLookup[this.units[i].type] * randomSample(damageDistribution);
  }

  return counter;  
}

// Power determining method without random element
function properPower() {

  var counter = 0;
  for (var i = 0; i < this.units.length; i++) {
    counter += powerLookup[this.units[i].type];
  }

  return counter;  
}

// Applies a given amount of damage to a square
function damage(damage, attack) {
  var damageRemaining = damage;
  var totalDamage = 0;

  this.units.sort(function(a, b) {
    return powerLookup[b.type] - powerLookup[a.type];
  });

  if (attack) {
    while (damageRemaining > 0) {
      if (this.units.length > 0 && powerLookup[this.units[0].type] <= damageRemaining && this.units[0].movesLeft > 0) {
        damageRemaining -= powerLookup[this.units[0].type];
        totalDamage += powerLookup[this.units[0].type];
        deleteUnitByType(this, this.units[0].type, 1);
        if (this.units.length == 0) { break; }
      } else {
        break;
      }
    }
  } else {
    while (damageRemaining > 0) {
      if (this.units.length > 0 && powerLookup[this.units[0].type] <= damageRemaining) {
        damageRemaining -= powerLookup[this.units[0].type];
        totalDamage += powerLookup[this.units[0].type];
        deleteUnitByType(this, this.units[0].type, 1);
        if (this.units.length == 0) { break; }
      } else {
        break;
      }
    }    
  }

  return totalDamage;
}

function numberOfActiveUnits() {
  var counter = 0;
  for (var i = 0; i < this.units.length; i++) {
    if (this.units[i].movesLeft > 0) {
      counter++;
    }
  }
  return counter;
}

function hasAnEmptyShip() {

  for (var i = 0; i < this.units.length; i++) {
    if (this.units[i].type == "ship" && this.units[i].transport.length < 8) {
      return true;
    }
  }
  return false;
}

function returnAnEmptyShip() {
  if (!this.hasAnEmptyShip()) { return false; }
  for (var i = 0; i < this.units.length; i++) {
    if (this.units[i].type == "ship" && !this.units[i].full()) {
      return this.units[i];
    }
  }
}

function allUnitsIncludingTransport() {
  var output = [];
  for (var i = 0; i < this.units.length; i++) {
    output.push(this.units[i]);
  }

  for (var i = 0; i < this.units.length; i++) {
    if (this.units[i].type == "ship") {
      for (var j = 0; j < this.units[i].transport.length; j++) {
        output.push(this.units[i].transport[j]);
      }
    }
  }

  return output;
}


function removeFromTransport(type, movesLeft) {

  for (var i = 0; i < this.units.length; i++) {
    if (this.units[i].type == "ship") {
      var newTransport = [];
      var done = false;
      for (var j = 0; j < this.units[i].transport.length; j++) {
        if (this.units[i].transport[j].type != type || this.units[i].transport[j].movesLeft != movesLeft || done) {
          newTransport.push(this.units[i].transport[j]);
        } else {
          done = true;
        }
      }
      if (done) { 
        this.units[i].transport = newTransport;
        break; 
      }
    }
  }
}

Square.prototype.removeFromTransport = removeFromTransport;
Square.prototype.allUnitsIncludingTransport = allUnitsIncludingTransport;
Square.prototype.returnAnEmptyShip = returnAnEmptyShip;
Square.prototype.hasAnEmptyShip = hasAnEmptyShip;
Square.prototype.neighbours = neighbours;
Square.prototype.addUnit = addUnit;
Square.prototype.count = count;
Square.prototype.exactCount = exactCount;
Square.prototype.isCostal = isCostal;
Square.prototype.listOfMovesLeft = listOfMovesLeft;
Square.prototype.inactivateAll = inactivateAll;
Square.prototype.power = power;
Square.prototype.attackPower = attackPower;
Square.prototype.damage = damage;
Square.prototype.numberOfActiveUnits = numberOfActiveUnits;
VisionSquare.prototype.neighbours = visionNeighbours;