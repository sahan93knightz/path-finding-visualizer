export class Maze {
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