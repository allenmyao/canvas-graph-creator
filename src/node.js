export class Node {
    static numNodes = 0;

    static radius = 50;

    constructor(x, y) {
        this.id = this.numNodes++;
        this.x = x;
        this.y = y;
    }

    get id() {
        return this.id;
    }

    get x() {
        return this.x;
    }

    set x(x) {
        this.x = x;
    }

    get y() {
        return this.y;
    }

    set y(y) {
        this.y = y;
    }

    draw(context) {
        console.log('Drawing node ' + this.id);

        // Create a new path
        context.beginPath();

        // Create an arc with center at (x, y)
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

        // Draw to the canvas
        context.stroke();
    }
}

console.log('test');
