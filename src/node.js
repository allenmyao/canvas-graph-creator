export class Node {
    static numNodes = 0;

    static radius = 30;
    edgeList = [];
    id = Node.numNodes++;
    isSelected = false;

    constructor(x, y) {
        if (arguments.length < 2) {
            throw Error(`Node constructor requires two arguments: x, y. Actually passed in ${arguments}`);
        }
        this.x = x;
        this.y = y;
    }

    containsPoint(x, y) {
        return this.distanceToPoint(x, y) <= Node.radius;
    }

    distanceToPoint(x, y) {
        let dx = x - this.x;
        let dy = y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    edgePointInDirection(x, y) {
        if(x==this.x && y==this.y){
          throw new Error("Point is at origin of Node")
        }
        let dx = x - this.x;
        let dy = y - this.y;
        let scale = Math.sqrt(dx * dx + dy * dy);
        return {
            x: this.x + dx * Node.radius / scale,
            y: this.y + dy * Node.radius / scale
        };
    }

    draw(context) {
        // console.log('Drawing node ' + this.id + ' at (' + this.x + ',' + this.y + ')');

        context.fillStyle = 'white';
        context.strokeStyle = this.isSelected ? 'red' : 'black';

        this.svg(context);
    }

    arc(context) {
        // Create a new path
        context.beginPath();

        // Create an arc with center at (x, y)
        context.arc(this.x, this.y, Node.radius, 0, 2 * Math.PI);

        // Draw to the canvas
        // context.fill();
        context.stroke();
    }

    svg(context) {
        let path = new Path2D(this.circle(this.x, this.y, Node.radius));
        // context.fill(path);
        context.stroke(path);
    }

    circle(x, y, r) {
        r = Math.abs(r);
        return `
                M ${x} ${y}
                m ${-1 * r}, 0
                a ${r},${r} 0 1,0 ${r * 2},0
                a ${r},${r} 0 1,0 ${r * -2},0
                `;
    }


}
