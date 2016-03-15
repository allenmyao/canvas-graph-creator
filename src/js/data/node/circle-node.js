import { Node } from './node';
import { MetadataTool } from 'tool/metadata-tool';


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

    // Create a new path
    context.beginPath();

    // Create an arc with center at (x, y)
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    // Draw to the canvas
    // context.fill();
    context.stroke();

    if(this.nodeLabel != ''){
      if(this.isSelected){
        context.font = "14px Arial"
        context.fillText("nodeLabel", xText, yText);
      }
    }

    if (this.isAcceptingState) {
      context.moveTo(this.x + this.radius * 0.75, this.y);
      context.arc(this.x, this.y, this.radius * 0.75, 0, 2 * Math.PI);
      context.stroke();
    }

    if (this.isStartingState) {
      context.fillStyle = this.isSelected ? 'red' : 'black';
      context.moveTo(this.x - 55, this.y - 55);
      context.lineTo(this.x - 25, this.y - 25);
      context.stroke();
      context.beginPath();
      context.moveTo(this.x - 25, this.y - 25);
      context.lineTo(this.x - 25 - 6 - 3, this.y - 25 - 6 + 3);
      context.lineTo(this.x - 25 - 6, this.y - 25 - 6);
      context.lineTo(this.x - 25 - 6 + 3, this.y - 25 - 6 - 3);
      context.closePath();
      context.fill();
    }
  }

}
