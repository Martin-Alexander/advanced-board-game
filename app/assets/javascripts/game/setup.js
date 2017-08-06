var canvas
var canvasContext;
var sourceImage;
var hand;

$(document).ready(function() {
  canvas = document.getElementById("canvas");
  canvasContext = canvas.getContext("2d");  

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  canvasContext.translate(canvas.width / 2, 0);
  sourceImage = document.getElementById("image-source");

  hand = new Hand;

  initializeMouseListener();

  newGame();

  renderingLoop();
});
