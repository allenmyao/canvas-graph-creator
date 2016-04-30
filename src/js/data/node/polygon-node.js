import Node from './node';
import Label from '../label';

/**
 * Node subclass for polygon nodes.
 * @class PolygonNode
 */
class PolygonNode extends Node {

  radius = 30;

  inscribed = [];
  separation;

  /**
   * Constructs a PolygonNode instance. Should not be called directly.
   * @param  {number} x - x-coordinate of the node.
   * @param  {number} y - y-coordinate of the node.
   * @constructs PolygonNode
   */
  constructor(x, y) {
    super(x, y);
    this.label = new Label(this.x + this.radius + 4, this.y, this);
  }

  /**
   * Check if the node contains the given point.
   * @param  {number} x - x-coordinate of the point.
   * @param  {number} y - y-coordinate of the point.
   * @return {boolean} - Whether or not the node contains the point.
   * @override
   */
  containsPoint(x, y) {
    return this.distanceToPoint(x, y) <= this.radius;
  }

  /**
   * Find the distance from the node's coordinates to a given point.
   * @param  {number} x - x-coordinate of the point.
   * @param  {number} y - y-coordinate of the point.
   * @returns {number} - The distance to the point.
   * @override
   */
  distanceToPoint(x, y) {
    let dx = x - this.x;
    let dy = y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Find the point on the edge of the node in the direction of the given point.
   * @param  {number} x - x-coordinate of the point.
   * @param  {number} y - y-coordinate of the point.
   * @returns {Object} - The edge point in the direction of the given point.
   * @property {number} x - x-coordinate of the edge point.
   * @property {number} y - y-coordinate of the edge point.
   * @override
   */
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

  /**
   * Draw the node on the given canvas context.
   * @param  {CanvasRenderingContext2D} context - Canvas 2D context.
   * @override
   */
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

  /**
   * Draw additional objects to display the node as an accepting state on the given canvas context.
   * @param {CanvasRenderingContext2D} context - Canvas 2D context.
   */
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
    context.fill();
    context.stroke();
  }

  /**
   * Draw additional objects to display the node as a starting state on the given canvas context.
   * @param {CanvasRenderingContext2D} context - Canvas 2D context.
   */
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

  /**
   * Get the point on the edge of the node at the given angle.
   * @param  {number} arbangle - The angle (clockwise from +x axis).
   * @returns {Object} - The edge point in the direction of the given angle.
   * @property {number} x - x-coordinate of the edge point.
   * @property {number} y - y-coordinate of the edge point.
   * @override
   */
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

export { PolygonNode };
export default PolygonNode;
