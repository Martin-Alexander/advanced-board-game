function initializeMouseListener() {

  canvas.addEventListener("mousemove", function(event) {

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
    hand.hoverTile = {
      x: Math.floor((hand.mouseIsoPosition.x) / tileHeight),
      y: Math.floor((hand.mouseIsoPosition.y) / tileHeight)
    }
  });

  canvas.addEventListener("mouseup", function() {
    
    hand.click();

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
    hand.hoverTile = {
      x: Math.floor((hand.mouseIsoPosition.x) / tileHeight),
      y: Math.floor((hand.mouseIsoPosition.y) / tileHeight)
    }
  });
}