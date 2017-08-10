// Global variables

const xSize = 40;
const ySize = 40;
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
const knightMoves = 2;
const workerMoves = 2;
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

const pillageLootLookup = {
  base: 16,
  farm: 4
}