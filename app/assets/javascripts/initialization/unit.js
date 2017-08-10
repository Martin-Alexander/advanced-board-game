/*

Units will have many propties such as power and number of moves, but because
all units essentially belong to totally different classes - each very different
and with special abilities - these properties will be handled on a case by case 
basis OUTSIDE of the unit object

*/

function Unit() {
  this.type;      // "knight", "scout", "garrison", "worker", "ship"
  this.movesLeft; // Number of moves left to move 
  this.player;    // Although this can be determined by the player status of the
                  // square that the unit is in I may want to allow for a "spy"
                  // unit to be able to occupy enemy squares
  this.transport;
}

function embark(unit) {
  this.transport.push(unit);
}

function full() {
  if (this.transport.length > 7) {
    return true;
  } else {
    return false;
  }
}

Unit.prototype.embark = embark;
Unit.prototype.full = full;