export class curvedEdge {


    startx = null;
    starty = null;
    cpx = null;  //bezier control point
    cpy = null;  //bezier control point
    destx = null;
    desty = null;

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
        this.cpx = cpx; //need to change
        this.cpy = cpy; //need to change 
        this.destx = destPoint.x;
        this.desty = destPoint.y;
    }

    draw(context) {
        // console.log('Drawing edge from ' + this.start.id + ' to ' + this.dest.id);

        context.strokeStyle = 'black';

        this.svg(context);
    }


        path(context) {
        // Create a new path
        context.beginPath();

        /
        // Draw line to given point
        context.quadraticCurveTo(this.cpx, this.cpy, this.destx, this.desty);

        // Draw to the canvas
        context.stroke();
    }

    svg(context) {
        let path = new Path2D(this.arc(this.startx, this.starty, this.destx, this.desty));
        context.stroke(path);
    }

    line(x1, y1, x2, y2) {
        // A 300,300 0 0,0
        return `
                M ${x1},${y1}
                L ${x2},${y2}
                `;
    }
}