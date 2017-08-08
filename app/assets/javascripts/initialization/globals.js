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

const scoutMoves = 2;
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