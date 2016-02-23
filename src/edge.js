export class Edge {

    constructor(start, dest, weight = null, isDirected = false) {
        this.start = start;
        this.dest = dest;
        this.weight = weight;
        this.isDirected = isDirected;
    }

    containsPoint(x, y) {
        // TODO: implement this
        return false;
    }

    draw(context) {
        let startPoint;
        let destPoint;
        try {
            startPoint = this.start.edgePointInDirection(this.dest.x, this.dest.y);
            destPoint = this.dest.edgePointInDirection(this.start.x, this.start.y);
        } catch (e) {
            return;
        }

        context.strokeStyle = 'black';

        // Create a new path
        context.beginPath();

        // Start path at given point
        context.moveTo(startPoint.x, startPoint.y);

        // Draw line to given point
        context.lineTo(destPoint.x, destPoint.y);

        // Draw to the canvas
        context.stroke();
    }

}
