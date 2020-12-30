const SPEED = 10
const BLOCK_SEED = 0.7
const START_SEED = 0.5
const END_SEED = 0.9888


class Cell {

    special = false;
    blocked = false;
    x = 0;
    y = 0;
    visited = false;
    found = false;
    parent;

    constructor(x, y, blocked) {
        this.x = x;
        this.y = y;
        this.blocked = blocked;
    }

}

class Maze {
    width;
    height;
    start;
    end;
    cells;

    constructor(cells, start, end, w, h) {
        this.cells = cells
        this.start = start
        this.end = end
        this.width = w
        this.height = h;
    }
}

function generateMaze(mazeWidth, mazeHeight) {
    let cells = [];
    var startSelected = false;
    var endSelected = false;
    var start;
    var end;
    for (let x = 0; x < mazeWidth; x++) {
        let row = [];
        for (let y = 0; y < mazeHeight; y++) {
            let blocked = Math.random() > BLOCK_SEED
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

function drawMaze(maze) {
    let mainDiv = document.getElementById('maze_container');
    let table = document.createElement('table');
    let tbody = document.createElement("tbody");

    for (rowIndex = 0; rowIndex < maze.width; rowIndex++) {

        let mazeRow = maze.cells[rowIndex];

        let row = document.createElement("tr");

        for (colIndex = 0; colIndex < maze.height; colIndex++) {
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

    mainDiv.appendChild(table);
}

class Queue {

    items = []

    push = (item) => {
        this.items.push(item)
    }

    get = () => {
        if (this.items.length === 0) return null;
        let first = this.items[0]
        this.items = this.items.slice(1, this.items.length)
        return first;
    }

    isEmpty = () => {
        return this.items.length === 0
    }
}

async function getNeighbors(cell, cells) {
    let n = [];
    for (x = -1; x <= 1; x++) {
        for (y = -1; y <= 1; y++) {
            console.log(x, y)
            if (!(x == 0 && y == 0) && !(x * x === y * y)) {
                let neighborRow = cells[cell.x + x];
                let neighbor;
                if (neighborRow) neighbor = neighborRow[cell.y + y]
                // console.log(neighbor)
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

function scanningCell(cell) {
    changeColor(cell, 255, 249, 51)
}

function visitCell(cell) {
    changeColor(cell, 255, 196, 51)
}
function foundNeighbour(cell) {
    changeColor(cell, 190, 242, 255)
}
function checkNeighbour(cell) {
    changeColor(cell, 48, 214, 255)
}

async function showPath(n) {
    while (n != null) {
        changeColor(n, 249, 48, 255)
        n = n.parent
        await timer(50)
    }
}

const timer = ms => new Promise(res => setTimeout(res, ms))

async function findPath(maze) {
    let q = new Queue();
    q.push([maze.start])

    do {
        let cells = q.get();
        for (const cell of cells) {
            if (!cell.visited) {
                scanningCell(cell)
                cell.visited = true
                // console.log(cell)
                let neighbors = await getNeighbors(cell, maze.cells);
                console.log(neighbors)
                for (const neighbor of neighbors) {
                    checkNeighbour(neighbor)
                    console.log(cell, neighbor)
                    neighbor.parent = cell
                    if (neighbor === maze.end) {
                        console.log("NEIGHBOUR FOUND");
                        showPath(neighbor);
                        return neighbor
                    };
                    await timer(SPEED);
                }
                q.push(neighbors)
                visitCell(cell)
            }
        }

    } while (!q.isEmpty())


}

let maze = generateMaze(20, 20);
console.log(maze)
drawMaze(maze);

let n = (findPath(maze));
console.log(n)