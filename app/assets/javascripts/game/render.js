function drawFromSource(input, x, y) {
  if (input == "mountain") {
    drawFromSource("grass", x, y)
  }
  canvasContext.save();
  canvasContext.translate((x - y) * (tileWidth / 2 + 0), (x + y) * (tileHeight / 2));
  canvasContext.drawImage(
    sourceImage, 
    1 + (65 * drawFromSourceLookup[input].x), 1 + (49 * drawFromSourceLookup[input].y), tileWidth, 49,
    -tileWidth / 2, 0, tileWidth, 49
  );
  canvasContext.restore();
}

function clearCanvas() {
  canvasContext.save();
  canvasContext.setTransform(1, 0, 0, 1, 0, 0);
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.restore();
}

function renderBoard() {
  for (var i = 0; i < xSize * ySize; i++) {
    var visionSquare = game.playerOne.vision.data[i];
    var square = game.globalBoard.data[i];

    drawFromSource(square.terrain, square.x, square.y);

    if (square.structure == "base" && square.player.number == 1) {
      drawFromSource("playerOneBase", square.x, square.y);
    } else if (square.structure == "base" && square.player.number == 2) {
      drawFromSource("playerTwoBase", square.x, square.y);
    }

    // For temporary testing purposes
    if (square.units.length > 0) {
      drawFromSource("playerOneScout", square.x, square.y);
    }


    // if (visionSquare.status == "black") {
    //   drawFromSource("black", visionSquare.x, visionSquare.y);
    // } else if (visionSquare.status == "visible") {
    //   drawFromSource(square.terrain, square.x, square.y);

    //   if (square.structure == "base" && square.player.number == 1) {
    //     drawFromSource("playerOneBase", square.x, square.y);
    //   } else if (square.structure == "base" && square.player.number == 2) {
    //     drawFromSource("playerTwoBase", square.x, square.y);
    //   }

    //   // For temporary testing purposes
    //   if (square.units.length > 0) {
    //     drawFromSource("playerOneScout", square.x, square.y);
    //   }
    // } else if (visionSquare.status == "fog") {
    //   drawFromSource(square.terrain, square.x, square.y);

    //   if (square.structure == "base" && square.player.number == 1) {
    //     drawFromSource("playerOneBase", square.x, square.y);
    //   } else if (square.structure == "base" && square.player.number == 2) {
    //     drawFromSource("playerTwoBase", square.x, square.y);
    //   }

    //   // For temporary testing purposes
    //   if (square.units.length > 0) {
    //     drawFromSource("playerOneScout", square.x, square.y);
    //   }

    //   drawFromSource("fog", square.x, square.y)
    // }

  }
}

function renderingLoop() {
  window.setInterval(function() {
    clearCanvas();
    fillBackground();
    renderBoard();
    hand.render();
    drawLeftBox();
    drawRightBox();
  }, 30);
  window.setInterval(function() {
    game.updateVision(game.playerOne);
  }, 10);
}

var drawFromSourceLookup = {
  grass: { x: 2, y: 0},
  water: { x: 3, y: 0},
  mountain: { x: 4, y: 0},
  playerOneBase: { x: 0, y: 0 },
  playerTwoBase: { x: 0, y: 1 },
  playerOneScout: { x: 2, y: 2},
  black: { x: 2, y: 3 },
  fog: { x: 3, y: 3 }
}

function drawSquareShape(color, x, y) {

  canvasContext.save();
  canvasContext.translate((x - y) * (tileWidth / 2 + 0), (y + x) * tileHeight / 2);
  canvasContext.translate(0, 16);
  canvasContext.beginPath();
  canvasContext.moveTo(0, 0);
  canvasContext.lineTo(tileWidth / 2, tileHeight / 2);
  canvasContext.lineTo(0, tileHeight);
  canvasContext.lineTo(-tileWidth / 2, tileHeight / 2);
  canvasContext.closePath();
  canvasContext.fillStyle = color;
  canvasContext.fill();
  canvasContext.restore();   
}

function drawLeftBox() {
  canvasContext.save();
  canvasContext.translate(canvasWidth / -2 - hand.offset.x, canvasHeight - 200 - hand.offset.y);
  var pattern = canvasContext.createPattern(textureImage, "repeat");
  canvasContext.fillStyle = pattern;
  canvasContext.fillRect(0, 0, 300, 200);
  canvasContext.restore();
}

function drawRightBox() {
  canvasContext.save();
  canvasContext.translate(canvasWidth / 2 - hand.offset.x - 250, 0 - hand.offset.y);
  var pattern = canvasContext.createPattern(textureImage, "repeat");
  canvasContext.fillStyle = pattern;
  canvasContext.fillRect(0, 0, 250, canvasHeight);
  canvasContext.restore();
}

function fillBackground() {
  canvasContext.save();
  canvasContext.translate(canvasWidth / -2 - hand.offset.x - 250, 0 - hand.offset.y);
  // var pattern = canvasContext.createPattern(textureImage2, "repeat");
  // canvasContext.fillStyle = "rgb(20, 20, 20)";
  // canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
  canvasContext.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
  canvasContext.fillStyle = "rgba(0, 0, 0, 0.3)";
  canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
  canvasContext.restore();
}