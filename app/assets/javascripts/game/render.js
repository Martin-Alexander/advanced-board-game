function clearCanvas() {
  canvasContext.save();
  canvasContext.setTransform(1, 0, 0, 1, 0, 0);
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.restore();
}

function renderBoard() {

  if (game.over || revealMap) {
  // if (true) {
    for (var i = 0; i < xSize * ySize; i++) {
      var square = game.globalBoard.data[i];
      placeTile(square);
    }
  } else {
    for (var i = 0; i < xSize * ySize; i++) {
      var visionSquare = currentPlayer.vision.data[i];
      var square = game.globalBoard.data[i];

      if (visionSquare.status == "black") {
        placeFog(visionSquare, "black");
      } else if (visionSquare.status == "fog") {
        placeFogTile(visionSquare) 
      } else if (visionSquare.status == "visible") {
        placeTile(square);
      }
    }
  }

}

function renderingLoop() {
  window.setInterval(function() {
    clearCanvas();
    game.updateVision(currentPlayer);
    fillBackground();
    renderBoard();
    hand.render();
  }, 60);
}

function serverLoop() {
  window.setInterval(function() {
    if (currentPlayer.isTurnPlayer) {
      game.sendToServer();
    }
  }, 1000);
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
  garrison2: { x: 0, y: 3 },
  shield11: { x: 0, y: 4 },
  shield12: { x: 1, y: 4 },
  shield13: { x: 2, y: 4 },
  shield14: { x: 3, y: 4 },
  shield15: { x: 4, y: 4 },
  shield16: { x: 1, y: 6 },
  shield21: { x: 0, y: 5 },
  shield22: { x: 1, y: 5 },
  shield23: { x: 2, y: 5 },
  shield24: { x: 3, y: 5 },
  shield25: { x: 4, y: 5 },
  shield26: { x: 0, y: 6 },
  fogbase1: { x: 2, y: 6 },
  fogbase2: { x: 3, y: 6 },
  shield01: { x: 0, y: 7 },
  shield02: { x: 1, y: 7 },
  shield03: { x: 2, y: 7 },
  shield04: { x: 3, y: 7 },
  shield05: { x: 4, y: 7 },
  shield06: { x: 4, y: 6 }
}

function drawSquareShape(color, x, y) {

  canvasContext.save();
  // canvasContext.translate((x - y) * (tileWidth / 2 + 0), (y + x) * tileHeight / 2);
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

// function drawSquareShapeRaw(color, x, y) {

//   canvasContext.save();
//   canvasContext.translate(0, 16);
//   canvasContext.beginPath();
//   canvasContext.moveTo(0, 0);
//   canvasContext.lineTo(tileWidth / 2, tileHeight / 2);
//   canvasContext.lineTo(0, tileHeight);
//   canvasContext.lineTo(-tileWidth / 2, tileHeight / 2);
//   canvasContext.closePath();
//   canvasContext.fillStyle = color;
//   canvasContext.fill();
//   canvasContext.restore();   
// }

function fillBackground() {
  canvasContext.save();
  canvasContext.translate(canvasWidth / -2 - hand.offset.x, 0 - hand.offset.y);
  canvasContext.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
  canvasContext.fillStyle = "rgba(0, 0, 0, 0.6)";
  canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
  canvasContext.restore();
}

// Returns are ordered array of sources to draw
function findImagesSources(square, foggy = false) {
  var output = ["grass"];

  output.push(square.terrain);
  

  if (!foggy) {
    if (square.structure) {
      output.push(square.structure + square.player.number);
    }
    if (square.units.length > 0) {
      if (hand.unitTypeSelect && square == hand.selectedTile) {
        output.push(hand.unitTypeSelect + square.player.number);
      } else {
        output.push(unitTypeMapper(square)[0] + square.player.number);
      }
      if (square.player == currentPlayer && square.numberOfActiveUnits() == 0) {
        output.push("shield0" + findPowerRange(square));
      } else {
        output.push("shield" + square.player.number + "" + findPowerRange(square));
      }
    }
  } else {
    if (square.structure == "farm")  {
      output.push("farm" + square.player.number);
      output.push("fog");
    } else if (square.structure == "base") {
      output.push("fog");
      output.push("fogbase" + square.player.number);
    } else {
      output.push("fog");
    }
  }

  return output;
}

// Draws a give source at a specified ABSOLUTE location
function drawSource(source, x, y) {
  if (drawFromSourceLookup[source] == undefined) { console.log (source); }
  canvasContext.drawImage(
    sourceImage, 
    1 + (65 * drawFromSourceLookup[source].x), 1 + (49 * drawFromSourceLookup[source].y), tileWidth, 49,
    x, y, tileWidth, 49
  );
}

// Draws a square representation at any give location
function drawSquare(square, x, y, foggy = false) {
  if (square.structure != null) {
    var cursorLevel = 2;
  } else {
    var cursorLevel = 1;
  }
  var toDraw = findImagesSources(square, foggy);
  for (var i = 0; i < toDraw.length; i++) {
    drawSource(toDraw[i], x, y);
    if (i == cursorLevel && hand.selectedTile == square) {
      drawSquareShape("rgba(255, 255, 255, 0.8)", hand.selectedTile.x, hand.selectedTile.y);
    }
    if (i == cursorLevel && hand.hoverTile && hand.hoverTile.x == square.x && hand.hoverTile.y == square.y) {
      drawSquareShape("rgba(255, 255, 255, 0.2)", hand.hoverTile.x, hand.hoverTile.y);
    }
  }
}

// Draws a square representaion at the correct location
function placeTile(square) {
  canvasContext.save();
  canvasContext.translate((square.x - square.y) * (tileWidth / 2 + 0), (square.x + square.y) * (tileHeight / 2));
  drawSquare(square, -tileWidth / 2, 0);
  canvasContext.restore();
}

function placeFogTile(square) {
  canvasContext.save();
  canvasContext.translate((square.x - square.y) * (tileWidth / 2 + 0), (square.x + square.y) * (tileHeight / 2));
  drawSquare(square, -tileWidth / 2, 0, true);
  canvasContext.restore();
}


function placeFog(square, fog) {
  canvasContext.save();
  canvasContext.translate((square.x - square.y) * (tileWidth / 2 + 0), (square.x + square.y) * (tileHeight / 2));
  // drawSquare(square, -tileWidth / 2, 0);
  drawSource(fog, -tileWidth / 2, 0);
  canvasContext.restore();
}