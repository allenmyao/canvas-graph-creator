export class Edge {
    constructor(start, dest, weight = null, isDirected = false) {
        this.start = start;
        this.dest = dest;
        this.weight = weight;
        this.isDirected = isDirected;
    }

    draw(context) {
        // console.log('Drawing edge from ' + this.start.id + ' to ' + this.dest.id);

        context.strokeStyle = 'black';

        // Create a new path
        context.beginPath();

        // Start path at given point
        context.moveTo(this.start.x, this.start.y);

        // Draw line to given point
        context.lineTo(this.dest.x, this.dest.y);

        // Draw to the canvas
        context.stroke();
    }
}
