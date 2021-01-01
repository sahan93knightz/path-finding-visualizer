export class Queue {

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

