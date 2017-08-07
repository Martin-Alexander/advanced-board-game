function clearCanvas() {
  canvasContext.save();
  canvasContext.setTransform(1, 0, 0, 1, 0, 0);
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.restore();
}

function renderBoard() {

  //  Looks nicer
  for (var i = 0; i < xSize * ySize; i++) {
    var visionSquare = game.playerOne.vision.data[i];
    var square = game.globalBoard.data[i];

    if (visionSquare.status == "visible" || visionSquare.status == "fog") {
      placeTile(square);
    }
  }

  for (var i = 0; i < xSize * ySize; i++) {
    var visionSquare = game.playerOne.vision.data[i];
    var square = game.globalBoard.data[i];

    if (visionSquare.status == "black") {
      placeFog(visionSquare, "black");
    } 
  }

  for (var i = 0; i < xSize * ySize; i++) {
    var visionSquare = game.playerOne.vision.data[i];
    var square = game.globalBoard.data[i];

    if (visionSquare.status == "fog") {
      placeFog(visionSquare, "fog");
    }
  }

  // Better performance
  // for (var i = 0; i < xSize * ySize; i++) {
  //   var visionSquare = game.playerOne.vision.data[i];
  //   var square = game.globalBoard.data[i];

  //   if (visionSquare.status == "visible" || visionSquare.status == "fog") {
  //     placeTile(square);
  //   } else {
  //     placeFog(visionSquare, "black");
  //   }
  // }

  // for (var i = 0; i < xSize * ySize; i++) {
  //   var visionSquare = game.playerOne.vision.data[i];
  //   var square = game.globalBoard.data[i];

  //   if (visionSquare.status == "black") {
  //     placeFog(visionSquare, "black");
  //   } 
  // }
}

function renderingLoop() {
  window.setInterval(function() {
    clearCanvas();
    fillBackground();
    renderBoard();
    hand.render();
  }, 60);
  window.setInterval(function() {
    game.updateVision(game.playerOne);
  }, 60);
}

var drawFromSourceLookup = {
  grass: { x: 2, y: 0},
  water: { x: 3, y: 0},
  mountain: { x: 4, y: 0},
  black: { x: 2, y: 3 },
  fog: { x: 3, y: 3 },
  base1: { x: 0, y: 1 },
  base2: { x: 0, y: 0 },
  farm1: { x: 1, y: 1},
  farm2: { x: 1, y: 0},
  worker1: { x: 3, y: 1 },
  worker2: { x: 2, y: 1 },
  knight1: { x: 0, y: 2 },
  knight2: { x: 4, y: 1 },
  scout1: { x: 2, y: 2 },
  scout2: { x: 1, y: 2 },
  ship1: { x: 4, y: 2 },
  ship2: { x: 3, y: 2 },
  garrison1: { x: 1, y: 3 },
  garrison2: { x: 0, y: 3 }
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

function fillBackground() {
  canvasContext.save();
  canvasContext.translate(canvasWidth / -2 - hand.offset.x, 0 - hand.offset.y);
  canvasContext.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
  canvasContext.fillStyle = "rgba(0, 0, 0, 0.3)";
  canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
  canvasContext.restore();
}

// Returns are ordered array of sources to draw
function findImagesSources(square) {
  var output = ["grass"];

  output.push(square.terrain);
  
  if (square.structure) {
    output.push(square.structure + square.player.number);
  }

  if (square.units.length > 0) {
    output.push(unitTypeMapper(square)[0] + square.player.number);
  }

  return output;
}

// Draws a give source at a specified ABSOLUTE location
function drawSource(source, x, y) {
  canvasContext.drawImage(
    sourceImage, 
    1 + (65 * drawFromSourceLookup[source].x), 1 + (49 * drawFromSourceLookup[source].y), tileWidth, 49,
    x, y, tileWidth, 49
  );
}

// Draws a square representation at any give location
function drawSquare(square, x, y) {
  var toDraw = findImagesSources(square);

  for (var i = 0; i < toDraw.length; i++) {
    drawSource(toDraw[i], x, y);
  }
}

// Draws a square representaion at the correct location
function placeTile(square) {
  canvasContext.save();
  canvasContext.translate((square.x - square.y) * (tileWidth / 2 + 0), (square.x + square.y) * (tileHeight / 2));
  drawSquare(square, -tileWidth / 2, 0);
  canvasContext.restore();
}

function placeFog(square, fog) {
  canvasContext.save();
  canvasContext.translate((square.x - square.y) * (tileWidth / 2 + 0), (square.x + square.y) * (tileHeight / 2));
  // drawSquare(square, -tileWidth / 2, 0);
  drawSource(fog, -tileWidth / 2, 0);
  canvasContext.restore();  
}