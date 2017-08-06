function initializeMouseListener() {

  canvas.addEventListener("mousemove", function(event) {

    var rect = canvas.getBoundingClientRect();
    hand.mousePosition = {
      x: event.clientX - rect.left - canvasWidth / 2,
      y: event.clientY - rect.top + tileHeight / 2
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

  });
}