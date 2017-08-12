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

  // renderingLoop();

  // serverLoop();

  startGamePrompt();
});

$(window).on("blur focus", function(e) {
    var prevType = $(this).data("prevType");

    if (prevType != e.type) {   //  reduce double fire issues
        switch (e.type) {
            // case "blur":
            //     document.title = "YOUR TURN!!!";
            //     break;
            case "focus":
                document.title = "Muh Game";
                break;
        }
    }

    $(this).data("prevType", e.type);
})



function startGamePrompt() {
  var gameInfo;
  $.ajax({
    method: "POST",
    url: "/is_there_a_game",
    success: function(data) {
      gameInfo = data;
      console.log(gameInfo);

      if (gameInfo.game_exists) {
        $("#join-game-prompt").css({ display: "flex" });
        $("#join-game-prompt h1").text("Join Game As:");
      } else {
        $("#join-game-prompt").css({ display: "flex" });
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

function join(player) {
  $.ajax({
    method: "POST",
    url: "/join_game",
    data: {
      role: player
    },
    success: function(data) {
      startGameAs(data.role);
      if (data.otherPlayerReady) {
        game.generateNewBoard();
        game.sendToServer();
      } 
    }
  });  
}

function startGameAs(role) {

  newGame(); // WITHOUT generateNewBoard()
  renderingLoop();
  serverLoop();

  $("#join-game-prompt").css({ display: "none" });

  if (role == "observer") {
    currentPlayer = "observer";
  } else if (role == "playerOne") {
    currentPlayer = game.playerOne;
  } else if (role == "playerTwo") {
    currentPlayer = game.playerTwo;
  }
}
