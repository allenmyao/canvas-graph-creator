export class Node {
    static numNodes = 0;

    static radius = 10;

    id = Node.numNodes++;
    isSelected = false;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isSelected = false;
    }


    containsPoint(x, y) {
        return this.distanceToPoint(x, y) <= Node.radius;
    }

    distanceToPoint(x, y) {
        return Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2));
    }

    draw(context) {
        // console.log('Drawing node ' + this.id + ' at (' + this.x + ',' + this.y + ')');

        context.fillStyle = 'white';
        context.strokeStyle = this.isSelected ? 'red' : 'black';

        // Create a new path
        context.beginPath();

        // Create an arc with center at (x, y)
        context.arc(this.x, this.y, Node.radius, 0, 2 * Math.PI);

        // Draw to the canvas
        context.fill();
        context.stroke();
    }
}
