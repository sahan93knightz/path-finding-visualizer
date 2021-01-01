export class Cell {

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