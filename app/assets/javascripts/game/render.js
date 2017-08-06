function drawFromSource(x, y) {
  canvasContext.save();
  canvasContext.translate((x - y) * (tileWidth / 2 + 1), (x + y) * tileHeight / 2);
  canvasContext.drawImage(
    sourceImage, 
    1 + (65 * x), 1 + (49 * y), tileWidth, 49,
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