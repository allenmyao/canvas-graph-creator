import { Node } from './node';
import { MetadataTool } from 'tool/metadata-tool';


export class CircleNode extends Node {

  static radius = 30;

  radius = CircleNode.radius;

  constructor(x, y) {
    super(x, y);
    //console.log("Circle Node Ctor");
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
    let xOffSet = 0;
    let yOffset = 0;
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
      //xOffSet = context.measureText(this.nodeLabel)/2;
      context.font = "14px Arial"
      context.fillStyle = "black";
      context.fillText(this.nodeLabel, this.xText, this.yText);
      if(this.showTextCtrl) {
        context.fillStyle = "red";
        context.beginPath();
        context.arc(this.xText, this.yText, 3.0, 0, 1.5 * Math.PI);
        context.lineTo(this.xText, this.yText);
        context.fill();
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
  generateTextLocation(){

    if(){//default (to the right)
      this.xText = this.x + this.radius + 4;
      this.yText = this.y; 
    } 
    else if(){
    //place to the left
      this.xText = this.x -(this.radius + 4 + (context.measureText(this.nodeLabel)/2));
      this.yText = this.y;
    }
    else if(){
    //place on top
      this.xText = this.x - (context.measureText(this.nodeLabel)/2);
      this.yText = this.y + this.radius + 4; 
    }
    else if(){
    //place on the bottom
      this.xText = this.x - (context.measureText(this.nodeLabel)/2);
      this.yText = this.y -(this.radius + 4);
    }
    else if(){
    //place at top-right
      this.xText = this.x + this.radius + 4;
      this.yText = this.y + this.radius + 4;
    }
    else if(){
    //place at bottom-right
      this.xText = this.x + this.radius + 4;
      this.yText = this.y -(this.radius + 4);
    }
    else if(){
    //place at bottom-left
      this.xText = this.x -(this.radius + 4 + (context.measureText(this.nodeLabel)/2));
      this.yText = this.y -(this.radius + 4 + (context.measureText(this.nodeLabel)/2));
    }
    else if(){
    //place at top-left
      this.xText = this.x -(this.radius + 4 + (context.measureText(this.nodeLabel)/2));
      this.yText = this.y + this.radius + 4 + (context.measureText(this.nodeLabel)/2);
    }
    else{
    //just go back to default
      this.xText = this.x + this.radius + 4;
      this.yText = this.y; 

    }
  }




  //find the starting point of our text box
  generateDefaultTextLocation() {
    this.xText = this.x + this.radius + 4;
    this.yText = this.y; 
  }



}
