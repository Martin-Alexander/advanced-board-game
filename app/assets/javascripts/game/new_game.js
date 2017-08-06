// Takes the 'game' object and initializes as a brand new game state
function newGame() {

  // Back to turn 1
  game.turnNumber = 1;

  // Game gets a board
  game.globalBoard = new Board;

  // Set players
  game.playerOne = new Player;
  game.playerOne.id = 1;
  game.playerOne.isTurnPlayer = true;
  game.playerOne.gold = 0;
  game.playerOne.vision = new Board;
  game.playerOne.blind();

  game.playerTwo = new Player;
  game.playerTwo.id = 2;
  game.playerTwo.isTurnPlayer = false;
  game.playerTwo.gold = 0;
  game.playerTwo.vision = new Board;
  game.playerTwo.blind();

  // A randomly generated board
  game.generateNewBoard();

  renderBoard();
}