import { Edge } from './edge';
import { drawArrows } from './curvedEdge';

export class DashedEdge extends Edge {

  draw(context) {
    context.strokeStyle = 'black';
    context.setLineDash([ 5, 5 ]);

    // Create a new path
    context.beginPath();

    // Start path at given point
    context.moveTo(this.startPoint.x, this.startPoint.y);

    // Draw line to given point
    context.lineTo(this.destPoint.x, this.destPoint.y);

    // Draw to the canvas
    context.stroke();
    context.setLineDash([]);

    if (this.isDirected) {
      drawArrows(this, false, true);
    }
  }
}
