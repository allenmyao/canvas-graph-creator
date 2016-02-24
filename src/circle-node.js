import { Node } from './node';

export class CircleNode extends Node {

    static radius = 30;

    radius = CircleNode.radius;

    containsPoint(x, y) {
        return this.distanceToPoint(x, y) <= this.radius;
    }

    distanceToPoint(x, y) {
        let dx = x - this.x;
        let dy = y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // ISSSUE: if (x, y) is equal to the node's position, this function will divide by zero
    // rename to closestPointTo
    // modify to find closest point to another node
    edgePointInDirection(x, y) {
        if (x === this.x && y === this.y) {
            throw new Error('Point is at origin of Node');
        }
        let dx = x - this.x;
        let dy = y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        return {
            x: this.x + dx * this.radius / distance,
            y: this.y + dy * this.radius / distance
        };
    }

    draw(context) {
        context.fillStyle = 'white';
        context.strokeStyle = this.isSelected ? 'red' : 'black';

        this.arc(context);
    }

    arc(context) {
        // Create a new path
        context.beginPath();

        // Create an arc with center at (x, y)
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

        // Draw to the canvas
        // context.fill();
        context.stroke();
    }

}
