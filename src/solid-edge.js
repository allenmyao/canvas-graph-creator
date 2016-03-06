import { Edge } from './edge';

export class SolidEdge extends Edge {

  draw(context) {
    context.strokeStyle = 'black';

    // Create a new path
    context.beginPath();

    // Start path at given point
    context.moveTo(this.startPoint.x, this.startPoint.y);

    // Draw line to given point
    context.lineTo(this.destPoint.x, this.destPoint.y);

    // Draw to the canvas
    context.stroke();
  }
}
