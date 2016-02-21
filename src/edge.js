export class Edge {

    startx = null;
    starty = null;
    destx = null;
    desty = null;
    controlX = null;
    controlY = null;

    constructor(start, dest, weight = null, isDirected = false) {
        this.numEdges = 1;
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

    calculateEdges() {
        var c1x = this.start.x;
        var c1y = this.start.y;
        var c2x = this.dest.x;
        var c2y = this.dest.y;
        var r = 30;

        //auxiliary variables for conceptual understanding
        //will be refactored if needed
        var c2xtrans = c2x - c1x;
        var c2ytrans = c2y - c1y;
        var c1xtrans = 0;
        var c1ytrans = 0;
        var theta = Math.asin(c2ytrans/Math.sqrt(c2xtrans*c2xtrans + c2ytrans*c2ytrans));
        var c1xrot = 0;
        var c1yrot = 0;
        var c2xrot = c2xtrans*Math.cos(-theta) - c2ytrans*Math.sin(-theta);
        var c2yrot = 0;

        var edges = [];
        for(var i = 0; i < this.numEdges; i++){
            var currTheta = (Math.PI*(i+1)/(this.numEdges + 1) - Math.PI/2);
            var edgedata = [r*Math.cos(currTheta), r*Math.sin(currTheta),
                           c2xrot/2, c2xrot*(2*currTheta/Math.PI),
                           c2xrot - r*Math.cos(currTheta), r*Math.sin(currTheta)];
            //rotate and translate back
            for(var j = 0; j < 3; j++){
                var tempX = edgedata[2*j]*Math.cos(theta) - edgedata[2*j+1]*Math.sin(theta) + c1x;
                var tempY = edgedata[2*j]*Math.sin(theta) + edgedata[2*j+1]*Math.cos(theta) + c1y;
                edgedata[2*j] = tempX;
                edgedata[2*j+1] = tempY;
            }


            edges.push({
                startX: edgedata[0],
                startY: edgedata[1],
                controlX: edgedata[2],
                controlY: edgedata[3],
                destX: edgedata[4],
                destY: edgedata[5]
            });
        }
        return edges;
    }

    draw(context) {
        // console.log('Drawing edge from ' + this.start.id + ' to ' + this.dest.id);

        let edges = this.calculateEdges();

        context.strokeStyle = 'black';

        // this.svg(context);

        for (let edge of edges) {
            context.strokeStyle = 'black';
            context.beginPath();
            context.moveTo(this.start.x, this.start.y);
            context.quadraticCurveTo(edge.controlX, edge.controlY, this.dest.x, this.dest.y);
            context.strokeStyle = 'black';
            context.stroke();
        }
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




    svg(context) {
        let path = new Path2D(this.line(this.startx, this.starty, this.destx, this.desty));
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
