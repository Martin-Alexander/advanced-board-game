function initializeMouseListener() {

  window.addEventListener("keydown", function(e) { if (e.keyCode == 9) {e.preventDefault(); } });

  window.addEventListener("keyup", function(event) {

    switch (event.keyCode) {
      case 9:
        hand.tab(); break;
      case 70:
        hand.build("farm"); break;
      case 66:
        hand.build("base"); break;
      case 16:
        hand.shiftDown = false; break;
      case 17:
        hand.ctrlDown = false; break;
    }
  });

  window.addEventListener("keydown", function(event) {

    switch (event.keyCode) {
      case 16:
        hand.shiftDown = true; break;
      case 17:
        hand.ctrlDown = true; break;
    }
  });

  canvas.addEventListener("dblclick", function(event) {
    
    var rect = canvas.getBoundingClientRect();
    var trueMousePosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }

    var mousePosition = {
      x: ((event.clientX - rect.left - canvasWidth / 2)) - hand.offset.x,
      y: (event.clientY - rect.top + tileHeight / 2 - 34) - hand.offset.y
    };

    var mouseIsoPosition = {
      x: (mousePosition.x + 2 * mousePosition.y) / 2,
      y: (2 * mousePosition.y - mousePosition.x) / 2
    }

    if (
      Math.floor((mouseIsoPosition.x) / tileHeight) >= 0 &&
      Math.floor((mouseIsoPosition.x) / tileHeight) < xSize &&
      Math.floor((mouseIsoPosition.y) / tileHeight) >= 0 &&
      Math.floor((mouseIsoPosition.y) / tileHeight) < ySize
    ) {
      var hoverTile = {
        x: Math.floor((mouseIsoPosition.x) / tileHeight),
        y: Math.floor((mouseIsoPosition.y) / tileHeight)
      }
    } else {
      var hoverTile = undefined;
    }

    if (hoverTile) {
      console.log(game.globalBoard.square(hoverTile.x, hoverTile.y));
    }
  });

  canvas.addEventListener("mousemove", function(event) {

    setMouseInput();
  });

  canvas.addEventListener("mouseup", function() {
    
    hand.click();
    setMouseInput();
  });

}

function setMouseInput() {
  var rect = canvas.getBoundingClientRect();
  hand.trueMousePosition = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }

  hand.mousePosition = {
    x: ((event.clientX - rect.left - canvasWidth / 2)) - hand.offset.x,
    y: (event.clientY - rect.top + tileHeight / 2 - 34) - hand.offset.y
  };
  hand.mouseIsoPosition = {
    x: (hand.mousePosition.x + 2 * hand.mousePosition.y) / 2,
    y: (2 * hand.mousePosition.y - hand.mousePosition.x) / 2
  }
  if (
    Math.floor((hand.mouseIsoPosition.x) / tileHeight) >= 0 &&
    Math.floor((hand.mouseIsoPosition.x) / tileHeight) < xSize &&
    Math.floor((hand.mouseIsoPosition.y) / tileHeight) >= 0 &&
    Math.floor((hand.mouseIsoPosition.y) / tileHeight) < ySize
  ) {
    hand.hoverTile = {
      x: Math.floor((hand.mouseIsoPosition.x) / tileHeight),
      y: Math.floor((hand.mouseIsoPosition.y) / tileHeight)
    }
  } else {
    hand.hoverTile = undefined;
  }
}