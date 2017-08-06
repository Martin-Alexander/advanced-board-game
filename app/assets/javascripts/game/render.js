function drawFromSource(input, x, y) {
  if (input == "mountain") {
    drawFromSource("grass", x, y)
  }
  canvasContext.save();
  canvasContext.translate((x - y) * (tileWidth / 2 + 1), (x + y) * (tileHeight / 2));
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
  clearCanvas();
  for (var i = 0; i < xSize * ySize; i++) {
    var square = game.globalBoard.data[i];
    drawFromSource(square.terrain, square.x, square.y);

    if (square.structure == "base" && square.player.number == 1) {
      drawFromSource("playerOneBase", square.x, square.y);
    } else if (square.structure == "base" && square.player.number == 2) {
      drawFromSource("playerTwoBase", square.x, square.y);
    }
  }
}

var drawFromSourceLookup = {
  grass: { x: 2, y: 0},
  water: { x: 3, y: 0},
  mountain: { x: 4, y: 0},
  playerOneBase: { x: 0, y: 0 },
  playerTwoBase: { x: 0, y: 1 }
}