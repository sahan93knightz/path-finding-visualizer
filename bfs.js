import { Queue } from "./queue.js";
import { scanningCell, getNeighbors, checkNeighbour, timer, getSpeed, showPath, visitCell } from "./util.js";

export async function findPath(maze) {
    let q = new Queue();
    q.push([maze.start])

    do {
        let cells = q.get();
        for (const cell of cells) {
            if (!cell.visited) {
                scanningCell(cell)
                cell.visited = true

                let neighbors = await getNeighbors(cell, maze.cells);

                for (const neighbor of neighbors) {
                    checkNeighbour(neighbor)

                    neighbor.parent = cell
                    if (neighbor === maze.end) {
                        console.log("NEIGHBOUR FOUND");
                        showPath(neighbor);
                        return neighbor
                    };
                    await timer(getSpeed());
                }
                q.push(neighbors)
                visitCell(cell)
            }
        }

    } while (!q.isEmpty())
}
