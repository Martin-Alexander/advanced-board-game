// Takes the 'game' object and initializes as a brand new game state
function newGame() {

  // Back to turn 1
  game.turnNumber = 1;

  // Game gets a board
  game.globalBoard = new Board;
  game.anEmptyBoard();

  // Set players
  game.playerOne = new Player;
  game.playerOne.number = 1;
  game.playerOne.isTurnPlayer = true;
  game.playerOne.gold = startingGold;
  game.playerOne.numberOfFarms = 0;
  game.playerOne.numberOfBases = 1;
  game.playerOne.vision = new Board;
  game.playerOne.blind();

  game.playerTwo = new Player;
  game.playerTwo.number = 2;
  game.playerTwo.isTurnPlayer = false;
  game.playerTwo.gold = startingGold;
  game.playerTwo.numberOfFarms = 0;
  game.playerTwo.numberOfBases = 1;  
  game.playerTwo.vision = new Board;
  game.playerTwo.blind();

  game.observer = new Player;
  game.observer.number = 3;
  game.observer.isTurnPlayer = false;
  game.observer.gold = 0;
  game.observer.numberOfFarms = 0;
  game.observer.numberOfBases = 0;  
  game.observer.vision = new Board;
  game.observer.observerVision();
}