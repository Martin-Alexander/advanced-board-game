var canvas
var canvasContext;
var sourceImage;
var hand;
var currentPlayer;
var boardHasBeenGenerated = false;

$(document).ready(function() {
  canvas = document.getElementById("canvas");
  canvasContext = canvas.getContext("2d");  

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  canvasContext.translate(canvas.width / 2, 0);
  sourceImage = document.getElementById("image-source");
  textureImage = document.getElementById("texture-source");
  textureImage2 = document.getElementById("texture-2-source");
  backgroundImage = document.getElementById("background");

  hand = new Hand;

  initializeMouseListener();

  // newGame();

  // Each player has a browser, and this variables deterines which player that is
  currentPlayer = game.playerOne;

  // renderingLoop();

  // serverLoop();

  startGamePrompt();
});


function startGamePrompt() {
  var gameInfo;
  $.ajax({
    method: "POST",
    url: "/is_there_a_game",
    success: function(data) {
      gameInfo = data;
      console.log(gameInfo);
      $("#join-game-prompt").css({ display: "flex" });

      if (gameInfo.game_exists) {
        $("#join-game-prompt h1").text("Join Game As:");
      } else {
        $("#join-game-prompt h1").text("Start Game As:");
      }
      if (!gameInfo.player_one) {
        $("#join-game-prompt h2:nth-child(2)").text("Player One");
        $("#join-game-prompt h2:nth-child(2)").on("click", function() { join("playerOne"); });
      }
      if (!gameInfo.player_two) {
        $("#join-game-prompt h2:nth-child(3)").text("Player Two");
        $("#join-game-prompt h2:nth-child(3)").on("click", function() { join("playerTwo"); });
      }
    }
  });
}

function startGameAs(role) {

  newGame(); // WITHOUT generateNewBoard()
  renderingLoop();
  serverLoop();

  if (role == "observer") {
    currentPlayer = "observer";
  } else if (role == "playerOne") {
    currentPlayer = game.playerOne;
  } else if (role == "playerTwo") {
    currentPlayer = game.playerTwo;
  }
}

function join(player) {
  $.ajax({
    method: "POST",
    url: "/join_game",
    data: {
      role: player
    },
    success: function(data) {
      startGameAs(data.role);
      $("#join-game-prompt").css({ display: "none" });
      if (data.otherPlayerReady) {
        game.generateNewBoard();
        if (currentPlayer.number == 2) { game.sendToServer(); }
      } 
    }
  });  
}