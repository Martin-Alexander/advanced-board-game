/*

Units will have many propties such as power and number of moves, but because
all units essentially belong to totally different classes - each very different
and with special abilities - these properties will be handled on a case by case 
basis OUTSIDE of the unit object

*/

function Unit() {
  this.type; // "knight", "scout", "garrison", "worker", "ship"
  this.movesLeft; // Number of moves left to move 
}