var canvas
var canvasContext;
var sourceImage;
var hand;
var currentPlayer;

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

  newGame();

  // Each player has a browser, and this variables deterines which player that is
  currentPlayer = game.playerOne;

  renderingLoop();
});
