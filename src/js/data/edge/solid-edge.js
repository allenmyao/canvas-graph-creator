import { Edge } from './edge';
import { drawArrows } from '../../util/curvedEdge';

export class SolidEdge extends Edge {

  draw(context) {
    context.strokeStyle = this.isSelected ? 'red' : 'black';

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

    if (this.edgeLabel !== '') {
      context.font = '14px Arial';
      context.fillStyle = 'black';
      context.fillText(this.edgeLabel, this.xText, this.yText);
      if (this.showTextCtrl) {
        context.fillStyle = 'red';
        context.beginPath();
        context.arc(this.xText, this.yText, 3.0, 0, 1.5 * Math.PI);
        context.lineTo(this.xText, this.yText);
        context.fill();
      }
    }
  }

}
