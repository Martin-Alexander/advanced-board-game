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