import { Edge } from './edge';
import { drawArrows } from '../../util/curvedEdge';

export class SolidEdge extends Edge {

  draw(context) {
    context.strokeStyle = 'black';

    // Create a new path
    context.beginPath();

    // Start path at given point
    context.moveTo(this.startPoint.x, this.startPoint.y);

    // Draw line to given point
    context.quadraticCurveTo(this.bezierPoint.x, this.bezierPoint.y, this.destPoint.x, this.destPoint.y);

    // Draw to the canvas
    context.stroke();

    if (this.isDirected) {
      drawArrows(this, false, true);
    }

    if(this.edgeLabel != ''){
      if(this.isSelected){
        context.font = "14px Arial"
        context.fillText("edgeLabel", xText, yText);
      }
    }
  }

}
