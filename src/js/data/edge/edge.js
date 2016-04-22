import { calcBezierDistance, bezierDerivative } from '../../util/bezier';
import Label from '../label';

const EDGE_DISTANCE_THRESHOLD = 10;

export class Edge {

  static numEdges = 0;
  id = Edge.numEdges++;

  // graph data
  startNode;
  destNode;
  isDirected;
  partners = [];

  // status
  isSelected = false;

  // label
  label;

  // appearance
  color = '#000000';
  selectedColor = '#FF0000';
  lineWidth = 1;

  constructor(startNode, destNode) {
    let methods = [
      'draw'
    ];

    for (let method of methods) {
      if (typeof this[method] !== 'function') {
        throw TypeError('Must override method: ' + method);
      }
    }

    if (typeof startNode === 'undefined' || typeof destNode === 'undefined') {
      throw Error(`Edge constructor requires at least two arguments: startNode and destNode. Actually passed in ${startNode}, ${destNode}`);
    }

    this.startNode = startNode;
    this.destNode = destNode;

    startNode.edges.add(this);
    destNode.edges.add(this);

    // copy partners from an existing partner edge
    for (let edge of this.startNode.edges) {
      if (edge.startNode === this.startNode && edge.destNode === this.destNode) {
        this.partners = edge.partners.slice(0);
        break;
      } else if (edge.destNode === this.startNode && edge.startNode === this.destNode) {
        this.partners = edge.partners.slice(0);
        break;
      }
    }

    // add this edge to partners field of all partner edges
    for (let i = 0; i < this.partners.length; i++) {
      this.partners[i].partners.push(this);
    }
    this.partners.push(this);

    if (this.startNode === this.destNode) {
      this.isDirected = true;
      this.updateEndpoints();
    } else {
      for (let i = 0; i < this.partners.length; i++) {
        this.partners[i].updateEndpoints();
      }
    }

    this.label = new Label(this.bezierPoint.x, this.bezierPoint.y, this);
  }

  detach() {
    // remove this edge from partners of all partner edges
    for (let i = 0; i < this.partners.length; i++) {
      if (this.partners[i] === this) {
        continue;
      }
      let index = this.partners[i].partners.indexOf(this);
      this.partners[i].partners.splice(index, 1);
      this.partners[i].updateEndpoints();
    }

    this.startNode.edges.delete(this);
    this.destNode.edges.delete(this);
    this.startNode = null;
    this.destNode = null;
  }

  updateSelfLoopEndpoints() {
    this.startPoint = this.startNode.getAnglePoint(240);
    this.destPoint = this.startNode.getAnglePoint(300);
    this.bezierPoint = {
      x: (this.startPoint.x + this.destPoint.x) / 2,
      y: this.startPoint.y - 2 * this.startNode.radius
    };
  }

  updateNormalEdgeEndpoints() {
    let dx = this.destNode.x - this.startNode.x;
    let dy = this.destNode.y - this.startNode.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // calculate incline based on dy and distance
    // this is the angle between x-axis and the line from startNode to destNode
    let incline = Math.asin(dy / distance);
    // convert from radians to degrees
    incline = incline * 180 / Math.PI;

    // Note that canvas coordinates increase towards the bottom right
    // Quadrants are oriented as follows:
    //       |
    //   Q3  |  Q4
    //       |
    // ------------- +x
    //       |
    //   Q2  |  Q1
    //       |
    //       +y
    //

    // if destNode.x < startNode.x, the angle should end:
    //   in the second quadrant if destNode.y > startNode.y
    //   in the third quadrant if destNode.y < startNode.y
    if (this.startNode.x >= this.destNode.x) {
      if (this.startNode.y >= this.destNode.y) {
        incline = (540 - incline) % 360;
      } else {
        incline = 180 - incline;
      }
    }

    let numPartners = this.partners.length + 1;
    let multiIndex = this.partners.indexOf(this) + 1;

    let ratio = multiIndex / numPartners;

    // if the partner edge with index 0 is going in the opposite direction compared to the current edge
    // then draw the current edge on the opposite side of the line connecting the two nodes
    if (this.partners[0].startNode !== this.startNode) {
      ratio = 1 - ratio;
    }

    let startAngle = incline + 90 * ratio - 45;
    let destAngle = incline + 225 - 90 * ratio;
    this.startPoint = this.startNode.getAnglePoint(startAngle);
    this.destPoint = this.destNode.getAnglePoint(destAngle);

    let orient = ratio - 0.5;
    let diff = {
      x: this.destPoint.x - this.startPoint.x,
      y: this.destPoint.y - this.startPoint.y
    };
    this.bezierPoint = {
      x: (this.startPoint.x + this.destPoint.x) / 2 - orient * diff.y,
      y: (this.startPoint.y + this.destPoint.y) / 2 + orient * diff.x
    };
  }

  updateEndpoints() {
    if (this.startNode === this.destNode) {
      this.updateSelfLoopEndpoints();
    } else {
      this.updateNormalEdgeEndpoints();
    }
    if (this.label) {
      this.updateLabelLocation();
    }
  }

  containsPoint(x, y) {
    return EDGE_DISTANCE_THRESHOLD > calcBezierDistance(x, y, this.startPoint, this.bezierPoint, this.destPoint);
  }

  draw(context) {
    throw Error('Can\'t call draw from abstract Edge class.');
  }

  drawLabel(context) {
    this.label.draw(context);
  }

  drawArrow(context) {
    let slope = bezierDerivative(1, this.startPoint, this.bezierPoint, this.destPoint);
    let length = Math.sqrt(slope.x * slope.x + slope.y * slope.y);
    // normalize slope
    slope = { x: slope.x / length, y: slope.y / length };
    // perpendicular:
    context.beginPath();
    context.moveTo(this.destPoint.x, this.destPoint.y);
    context.lineTo(this.destPoint.x - 15 * slope.x - 5 * slope.y, this.destPoint.y - 15 * slope.y + 5 * slope.x);
    context.lineTo(this.destPoint.x - 9 * slope.x, this.destPoint.y - 9 * slope.y);
    context.lineTo(this.destPoint.x - 15 * slope.x + 5 * slope.y, this.destPoint.y - 15 * slope.y - 5 * slope.x);
    context.fill();
  }

  updateLabelLocation() {
    // TODO: properly update label position if moved
    this.label.x = this.bezierPoint.x;
    this.label.y = this.bezierPoint.y;
  }

}
