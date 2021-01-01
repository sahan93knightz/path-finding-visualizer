import { Cell } from "./cell.js";
import { Maze } from "./maze.js";


const START_SEED = 0.5
const END_SEED = 0.9888

var SPEED = 50

export function updateSpeed(speed) {
    SPEED = speed
}
export function getSpeed() {
    return SPEED
}

export function generateMaze(mazeWidth, mazeHeight, blockSeed) {
    let cells = [];
    var startSelected = false;
    var endSelected = false;
    var start;
    var end;
    for (let x = 0; x < mazeWidth; x++) {
        let row = [];
        for (let y = 0; y < mazeHeight; y++) {
            let blocked = Math.random() > blockSeed
            let cell = new Cell(x, y, blocked);
            if (!blocked) {
                if (!startSelected) {
                    startSelected = Math.random() > START_SEED;
                    start = cell;
                } else if (!endSelected) {
                    endSelected = Math.random() > END_SEED;
                    end = cell;
                }
            }
            row.push(cell);
        }
        cells.push(row)
    }
    start.special = true;
    end.special = true;
    return new Maze(cells, start, end, mazeWidth, mazeHeight)
}

export function drawMaze(maze) {
    let mainDiv = document.getElementById('maze_container');
    // mainDiv.style.width = (700 * (maze.width / (maze.width + maze.height))) + 'px'
    // mainDiv.style.height = 700 + (700 * (maze.height / (maze.width))) + 'px'
    let table = document.createElement('table');
    let tbody = document.createElement("tbody");

    for (let rowIndex = 0; rowIndex < maze.width; rowIndex++) {

        let mazeRow = maze.cells[rowIndex];

        let row = document.createElement("tr");

        for (let colIndex = 0; colIndex < maze.height; colIndex++) {
            let cell = mazeRow[colIndex]

            var col = document.createElement("td");

            if (cell.blocked == 1) {
                col.style.backgroundColor = "rgb(0,0,0)";
            }

            if (cell === maze.start) {

                col.style.backgroundColor = "rgb(244,0,0)";
                col.setAttribute("type", "start");

            } else if (cell === maze.end) {

                col.style.backgroundColor = "rgb(0,244,0)";
                col.setAttribute("type", "finish");

            }
            col.setAttribute("id", "cell_" + rowIndex + "_" + colIndex);

            row.appendChild(col);

        }

        tbody.appendChild(row);

    }

    table.appendChild(tbody);
    mainDiv.innerHTML = '';
    mainDiv.appendChild(table);
}

export async function getNeighbors(cell, cells) {
    let n = [];
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (!(x == 0 && y == 0) && !(x * x === y * y)) {
                let neighborRow = cells[cell.x + x];
                let neighbor;
                if (neighborRow) neighbor = neighborRow[cell.y + y]
                if (neighbor && !neighbor.blocked && !neighbor.visited && !neighbor.found) {
                    neighbor.found = true
                    foundNeighbour(neighbor)
                    n.push(neighbor)
                    await timer(SPEED)
                }
            }
        }
    }
    return n;
}

function changeColor(cell, r, g, b) {
    let tableCell = document.getElementById("cell_" + cell.x + "_" + cell.y);
    if (cell.special) {
        // tableCell.style.backgroundColor = `rgba(${r},${g},${b},0.5)`;
        tableCell.style.borderColor = `rgba(${r},${g},${b},0.9)`;
    } else {
        tableCell.style.backgroundColor = `rgb(${r},${g},${b})`;
    }
}

export function scanningCell(cell) {
    changeColor(cell, 255, 249, 51)
}

export function visitCell(cell) {
    changeColor(cell, 255, 196, 51)
}
export function foundNeighbour(cell) {
    changeColor(cell, 190, 242, 255)
}
export function checkNeighbour(cell) {
    changeColor(cell, 48, 214, 255)
}

export async function showPath(n) {
    while (n != null) {
        changeColor(n, 249, 48, 255)
        n = n.parent
        await timer(50)
    }
}

export const timer = ms => new Promise(res => setTimeout(res, ms))
