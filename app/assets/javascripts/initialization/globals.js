// Global variables

const xSize = 20;
const ySize = 20;
const tileWidth = 64;
const tileHeight = 32;

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

const leftBoxHeight = 200;
const leftBoxWidth = 300;
const rightBoxWidth = 250;

const farmIncome = 4;
const baseCost = 1;

const scoutMoves = 4;
const garrisonMoves = 0;
const knightMoves = 1;
const workerMoves = 1;
const shipMoves = 6;

const movesLeftLookup = {
  scout: scoutMoves,
  knight: knightMoves,
  worker: workerMoves,
  garrison: garrisonMoves,
  ship: shipMoves
}

const truePriority = ["knight", "scout", "ship", "worker", "garrison"];
const displayPriority = {
  costal: ["garrison", "knight", "scout", "ship", "worker"],
  landLocked: ["garrison", "knight", "scout", "worker"]
}

const powerLookup = {
  scout: 1,
  knight: 4,
  worker: 0,
  garrison: 8,
  ship: 8
}

const unitCostLookup = {
  scout: 1,
  knight: 1,
  worker: 1,
  garrison: 1,
  ship: 1 
}