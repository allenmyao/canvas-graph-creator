import { Node } from './node';

class CircleNode extends Node {

  static radius = 30;

  radius = CircleNode.radius;

  constructor(x, y) {
    super(x, y);
    this.generateDefaultTextLocation();
  }

  containsPoint(x, y) {
    return this.distanceToPoint(x, y) <= this.radius;
  }

  distanceToPoint(x, y) {
    let dx = x - this.x;
    let dy = y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

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
    // let xOffSet = 0;
    // let yOffset = 0;
    context.fillStyle = this.fillColor;
    context.strokeStyle = this.isSelected ? this.selectedColor : this.color;
    context.lineWidth = this.lineWidth;

    // Create a new path
    context.beginPath();

    // Create an arc with center at (x, y)
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    // Draw to the canvas
    context.fill();
    context.stroke();

    if (this.nodeLabel !== '') {
      this.drawLabel(context);
    }

    if (this.isAcceptingState) {
      this.drawAcceptingState(context);
    }

    if (this.isStartingState) {
      this.drawStartingState(context);
    }
  }

  drawLabel(context) {
    // xOffSet = context.measureText(this.nodeLabel)/2;
    context.font = this.labelFont;
    context.fillStyle = this.labelColor;
    context.fillText(this.nodeLabel, this.xText, this.yText);
    if (this.showTextCtrl) {
      context.fillStyle = 'red';
      context.beginPath();
      context.arc(this.xText, this.yText, 3.0, 0, 1.5 * Math.PI);
      context.lineTo(this.xText, this.yText);
      context.fill();
    }
  }

  drawAcceptingState(context) {
    context.fillStyle = this.fillColor;
    context.strokeStyle = this.isSelected ? this.selectedColor : this.color;
    context.moveTo(this.x + this.radius * 0.75, this.y);
    context.arc(this.x, this.y, this.radius * 0.75, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
  }

  drawStartingState(context) {
    let endpoint = this.getAnglePoint(225);
    context.fillStyle = this.isSelected ? this.selectedColor : this.color;
    context.strokeStyle = this.isSelected ? this.selectedColor : this.color;
    context.moveTo(endpoint.x - 30, endpoint.y - 30);
    context.lineTo(endpoint.x, endpoint.y);
    context.stroke();
    context.beginPath();
    context.moveTo(endpoint.x, endpoint.y);
    context.lineTo(endpoint.x - 6 - 3, endpoint.y - 6 + 3);
    context.lineTo(endpoint.x - 6, endpoint.y - 6);
    context.lineTo(endpoint.x - 6 + 3, endpoint.y - 6 - 3);
    context.closePath();
    context.fill();
  }

  /*
  generateTextLocation(){

    if () {
      // default (to the right)
      this.xText = this.x + this.radius + 4;
      this.yText = this.y;
    } else if () {
      // place to the left
      this.xText = this.x -(this.radius + 4 + (context.measureText(this.nodeLabel)/2));
      this.yText = this.y;
    } else if () {
      // place on top
      this.xText = this.x - (context.measureText(this.nodeLabel)/2);
      this.yText = this.y + this.radius + 4;
    } else if () {
      // place on the bottom
      this.xText = this.x - (context.measureText(this.nodeLabel)/2);
      this.yText = this.y -(this.radius + 4);
    } else if () {
      // place at top-right
      this.xText = this.x + this.radius + 4;
      this.yText = this.y + this.radius + 4;
    } else if () {
      // place at bottom-right
      this.xText = this.x + this.radius + 4;
      this.yText = this.y -(this.radius + 4);
    } else if() {
      // place at bottom-left
      this.xText = this.x -(this.radius + 4 + (context.measureText(this.nodeLabel)/2));
      this.yText = this.y -(this.radius + 4 + (context.measureText(this.nodeLabel)/2));
    } else if() {
      // place at top-left
      this.xText = this.x -(this.radius + 4 + (context.measureText(this.nodeLabel)/2));
      this.yText = this.y + this.radius + 4 + (context.measureText(this.nodeLabel)/2);
    } else {
      // just go back to default
      this.xText = this.x + this.radius + 4;
      this.yText = this.y;
    }
  }
*/

  getAnglePoint(angle) {
    return {
      x: this.x + this.radius * Math.cos(angle * Math.PI / 180),
      y: this.y + this.radius * Math.sin(angle * Math.PI / 180)
    };
  }

}

export { CircleNode };
export default CircleNode;
