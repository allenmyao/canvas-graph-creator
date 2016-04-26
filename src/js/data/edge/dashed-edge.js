import Edge from './edge';

class DashedEdge extends Edge {

  draw(context) {
    context.strokeStyle = this.isSelected ? this.selectedColor : this.color;
    context.lineWidth = this.lineWidth;
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
      context.fillStyle = this.isSelected ? this.selectedColor : this.color;
      this.drawArrow(context);
    }

    if (this.edgeLabel !== '') {
      this.drawLabel(context);
    }
  }

}

export { DashedEdge };
export default DashedEdge;
