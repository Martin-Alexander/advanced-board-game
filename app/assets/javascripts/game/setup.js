var canvas
var canvasContext;
var sourceImage;
var hand;

$(document).ready(function() {
  canvas = document.getElementById("canvas");
  canvasContext = canvas.getContext("2d");  

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  canvasContext.translate(canvas.width / 2, 32);
  sourceImage = document.getElementById("image-source");

  hand = new Hand;

  initializeMouseListener();
});
