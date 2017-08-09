function isPrime(num) {
  for(var i = 2; i < num; i++)
    if(num % i === 0) return false;
  return num !== 1;
}

function randomSample(array) {
  return array[Math.floor(Math.random() * (array.length ))];
}

function chance(int) {
  if (Math.random() * 100 < int) {
    return true;
  } else {
    return false;
  }
}

// Returns true if two squares are adjacent to each other
function areAdjacent(squareOne, squareTwo) {
  if (
    squareOne.x < squareTwo.x + 2 &&
    squareOne.x > squareTwo.x - 2 &&
    squareOne.y < squareTwo.y + 2 &&
    squareOne.y > squareTwo.y - 2
  ) {
    return true;
  } else {
    return false;
  }
}

// Returns an ordered array of unit types
function unitTypeMapper(square) {
  var output = [];
  var properOrder = ["garrison", "knight", "scout", "ship", "worker"];
  for (var i = 0; i < properOrder.length; i++) {
    for (var j = 0; j < square.units.length; j++) {
      if (square.units[j].type == properOrder[i]) {
        output.push(square.units[j].type);
        break;
      }
    }
  }
  return output;
}

// Moves a given number of units of a give type and `movesLeft` 
// Run NO validations
// May move this into an object
function moveOneUnit(fromSquare, toSquare, type, amount, movesLeft) {

  var newUnitsForFromSquare = [];
  var newUnitsForToSquare = [];
  var numberOfUnitsMoved = 0;

  for (var i = 0; i < fromSquare.units.length; i++) {
    if (fromSquare.units[i].type == type && fromSquare.units[i].movesLeft > 0 && numberOfUnitsMoved < amount && fromSquare.units[i].movesLeft == movesLeft) {
      fromSquare.units[i].movesLeft--;
      newUnitsForToSquare.push(fromSquare.units[i]);
      numberOfUnitsMoved++;
      toSquare.player = fromSquare.player;
    } else {
      newUnitsForFromSquare.push(fromSquare.units[i]);
    }
  }

  fromSquare.units = newUnitsForFromSquare;
  for (var i = 0; i < newUnitsForToSquare.length; i++) {
    toSquare.units.push(newUnitsForToSquare[i]); 
  }
}

function deleteUnit(square, type, amount, movesLeft) {

  var newUnitsForSquare = [];
  var numberOfUnitsDeleted = 0;

  for (var i = 0; i < square.units.length; i++) {
    if (square.units[i].type == type && square.units[i].movesLeft > 0 && numberOfUnitsDeleted < amount && square.units[i].movesLeft == movesLeft) {
            numberOfUnitsDeleted++;
    } else {
      newUnitsForSquare.push(square.units[i]);
    }
  }

  square.units = newUnitsForSquare;
}

function deleteUnitByType(square, type, amount) {

  var newUnitsForSquare = [];
  var numberOfUnitsDeleted = 0;

  for (var i = 0; i < square.units.length; i++) {
    if (square.units[i].type == type && square.units[i].movesLeft > 0 && numberOfUnitsDeleted < amount) {
            numberOfUnitsDeleted++;
    } else {
      newUnitsForSquare.push(square.units[i]);
    }
  }

  square.units = newUnitsForSquare;
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


// Is a given element found in a given array
function elementIsInArray(element, array) {
  for (var i = 0; i < array.length; i++) {
    if (element == array[i]) { return true; }
  }
  return false;
}

// Returns the power range of square for use in shield rendering
function findPowerRange(square) {

  if (powerOf(square) > 500) {
    return 6;
  } else if (powerOf(square) > 256) {
    return 5;
  } else if (powerOf(square) > 64) {
    return 4;
  } else if (powerOf(square) > 16) {
    return 3;
  } else if (powerOf(square) > 4) {
    return 2;
  } else {
    if (square.units.length > 1) {
      return 2;
    } else {
      return 1;
    }
  }
}

// Returns the total power of a square
function powerOf(square) {

  var counter = 0;
  for (var i = 0; i < square.units.length; i++) {
    counter += powerLookup[square.units[i].type];
  }

  return counter;  
}

// Applies a given amount of damage to a square
function damage(square, damage) {
  var damageRemaining = damage;
  var totalDamage = 0;

  square.units.sort(function(a, b) {
    return powerLookup[b.type] - powerLookup[a.type];
  });

  while (damageRemaining > 0) {
    if (square.units.length > 0 && powerLookup[square.units[0].type] <= damageRemaining) {
      damageRemaining -= powerLookup[square.units[0].type];
      totalDamage += powerLookup[square.units[0].type];
      deleteUnitByType(square, square.units[0].type, 1);
      if (square.units.length == 0) { break; }
    } else {
      break;
    }
  }

  return totalDamage;
}