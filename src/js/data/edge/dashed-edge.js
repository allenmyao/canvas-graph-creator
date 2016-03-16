import { Edge } from './edge';
import { drawArrows } from '../../util/curvedEdge';

export class DashedEdge extends Edge {

  draw(context) {
    context.strokeStyle = this.isSelected ? 'red' : 'black';
    context.setLineDash([ 5, 5 ]);

    // Create a new path
    context.beginPath();

    // Start path at given point
    context.moveTo(this.startPoint.x, this.startPoint.y);

    // Draw line to given point
    context.quadraticCurveTo(this.bezierPoint.x, this.bezierPoint.y, this.destPoint.x, this.destPoint.y);

    // Draw to the canvas
    context.stroke();
    context.setLineDash([]);

    if (this.isDirected) {
      drawArrows(this, false, true);
    }

    if(this.edgeLabel != ''){
      context.font = "14px Arial"
      context.fillStyle = "black";
      context.fillText(this.edgeLabel, xText, yText);
      if(this.isSelected) {

      }
    }
  }
}
