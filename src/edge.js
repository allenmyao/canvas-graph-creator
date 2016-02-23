export class Edge {

    startx = null;
    starty = null;
    destx = null;
    desty = null;
    controlX = null;
    controlY = null;

    constructor(start, dest, weight = null, isDirected = false) {
        this.start = start;
        this.dest = dest;
        this.weight = weight;
        this.isDirected = isDirected;
        this.update();
    }

    update() {
        let startPoint = this.start.edgePointInDirection(this.dest.x, this.dest.y);
        let destPoint = this.dest.edgePointInDirection(this.start.x, this.start.y);
        this.startx = startPoint.x;
        this.starty = startPoint.y;
        this.destx = destPoint.x;
        this.desty = destPoint.y;
        this.controlX = (this.startx + this.destx) / 2;
        this.controlY = (this.starty + this.desty) / 2;
    }

    containsPoint(x, y) {
        // TODO: implement this
        return false;
    }

    draw(context) {
        this.update();

        context.strokeStyle = 'black';

        this.path(context);
    }

    path(context) {
        // Create a new path
        context.beginPath();

        // Start path at given point
        context.moveTo(this.startx, this.starty);

        // Draw line to given point
        context.lineTo(this.destx, this.desty);

        // Draw to the canvas
        context.stroke();
    }

}
