import { Queue } from './queue.js'
import { Cell } from './cell.js'
import { Maze } from './maze.js'
import { findPath as bfsFind } from './bfs.js'
import { generateMaze, drawMaze, updateSpeed } from "./util.js";



const WIDTH_INPUT = document.getElementById("numberWidth");
const HEIGHT_INPUT = document.getElementById("numberHeight");
const BLOCK_SEED_INPUT = document.getElementById("rngBlockSeed");
const SPEED_INPUT = document.getElementById("rngSpeed");


SPEED_INPUT.addEventListener('change', () => updateSpeed(SPEED_INPUT.value));


document.getElementById("btnStart").addEventListener("click", function () {

    let maze = generateMaze(WIDTH_INPUT.value || 10, HEIGHT_INPUT.value || 10, BLOCK_SEED_INPUT.value || 0.7);
    console.log(maze)
    drawMaze(maze);
    updateSpeed(SPEED_INPUT.value);
    let n = (bfsFind(maze));
    console.log(n)
});
