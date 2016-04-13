import { Node } from './node';

export class PolygonNode extends Node {

  radius = 30;

  inscribed = [];
  separation;

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
    // let yOffSet = 0;
    context.fillStyle = this.fillColor;
    context.strokeStyle = this.isSelected ? this.selectedColor : this.color;
    context.lineWidth = this.lineWidth;

    // Create a new path
    context.beginPath();

    // Create a square around (this.x, this.y)
    context.moveTo(this.x + this.radius * Math.cos(this.inscribed[0] * Math.PI / 180),
                   this.y + this.radius * Math.sin(this.inscribed[0] * Math.PI / 180));
    // console.log(this.radius*Math.cos(this.inscribed[0]*Math.PI/180));
    for (let i = 1; i < this.inscribed.length; i++) {
      context.lineTo(this.x + this.radius * Math.cos(this.inscribed[i] * Math.PI / 180),
                     this.y + this.radius * Math.sin(this.inscribed[i] * Math.PI / 180));
    }
    context.closePath();

    // Draw to the canvas
    // context.fill();
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
    context.beginPath();
    context.moveTo(this.x + 0.75 * this.radius * Math.cos(this.inscribed[0] * Math.PI / 180),
                   this.y + 0.75 * this.radius * Math.sin(this.inscribed[0] * Math.PI / 180));
    for (let j = 1; j < this.inscribed.length; j++) {
      context.lineTo(this.x + 0.75 * this.radius * Math.cos(this.inscribed[j] * Math.PI / 180),
                     this.y + 0.75 * this.radius * Math.sin(this.inscribed[j] * Math.PI / 180));
    }
    context.closePath();
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

  getAnglePoint(arbangle) {
    let frac;
    let directionX;
    let directionY;
    let angle = (arbangle + 360) % 360;
    for (let i = 0; i < this.inscribed.length - 1; i++) {
      if (angle >= this.inscribed[i] && angle <= this.inscribed[i + 1]) {
        directionX = this.radius * Math.cos(this.inscribed[i + 1] * Math.PI / 180) -
                     this.radius * Math.cos(this.inscribed[i] * Math.PI / 180);
        directionY = this.radius * Math.sin(this.inscribed[i + 1] * Math.PI / 180) -
                     this.radius * Math.sin(this.inscribed[i] * Math.PI / 180);
        frac = (angle - this.inscribed[i]) / this.separation;
        return {
          x: this.x + this.radius * Math.cos(this.inscribed[i] * Math.PI / 180) + directionX * frac,
          y: this.y + this.radius * Math.sin(this.inscribed[i] * Math.PI / 180) + directionY * frac
        };
      }
    }
    if (angle > this.inscribed[this.inscribed.length - 1]) {
      frac = (angle - this.inscribed[this.inscribed.length - 1]) / this.separation;
    } else {
      frac = (360 - this.inscribed[this.inscribed.length - 1] + angle) / this.separation;
    }
    directionX = this.radius * Math.cos(this.inscribed[0] * Math.PI / 180) -
                 this.radius * Math.cos(this.inscribed[this.inscribed.length - 1] * Math.PI / 180);
    directionY = this.radius * Math.sin(this.inscribed[0] * Math.PI / 180) -
                 this.radius * Math.sin(this.inscribed[this.inscribed.length - 1] * Math.PI / 180);
    return {
      x: this.x + this.radius * Math.cos(this.inscribed[this.inscribed.length - 1] * Math.PI / 180) + directionX * frac,
      y: this.y + this.radius * Math.sin(this.inscribed[this.inscribed.length - 1] * Math.PI / 180) + directionY * frac
    };
  }

}
