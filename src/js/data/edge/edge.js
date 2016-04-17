import { calcBezierDistance, EDGE_DISTANCE_THRESHOLD } from '../../util/curvedEdge';

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
  xText;
  yText;
  edgeLabel = '';
  labelFont = '14px Arial';
  labelColor = 'black';
  showTextCtrl = false;

  // appearance
  color = 'black';
  selectedColor = 'red';
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

    if (arguments.length < 2) {
      throw Error(`Edge constructor requires at least two arguments: startNode and destNode. Actually passed in ${arguments}`);
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

    this.generateDefaultTextLocation();
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
    let incline = Math.asin((this.destNode.y - this.startNode.y) / Math.sqrt((this.destNode.x - this.startNode.x) * (this.destNode.x - this.startNode.x) + (this.destNode.y - this.startNode.y) * (this.destNode.y - this.startNode.y)));
    incline = incline * 180 / Math.PI;
    if (this.startNode.x >= this.destNode.x) {
      incline = 180 - incline;
    }
    incline = (incline + 360) % 360;

    let numPartners = this.partners.length + 1;
    let multiIndex = this.partners.indexOf(this) + 1;

    let startAngle = incline + 90 * multiIndex / numPartners - 45;
    let destAngle = incline + 225 - 90 * multiIndex / numPartners;
    this.startPoint = this.startNode.getAnglePoint(startAngle);
    this.destPoint = this.destNode.getAnglePoint(destAngle);

    let orient = multiIndex / numPartners - 0.5;
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
    this.updateTextLocation();
  }

  containsPoint(x, y) {
    return EDGE_DISTANCE_THRESHOLD > calcBezierDistance(x, y, this.startPoint.x, this.startPoint.y, this.bezierPoint.x, this.bezierPoint.y, this.destPoint.x, this.destPoint.y);
  }

  draw(context) {
    throw Error('Can\'t call draw from abstract Edge class.');
  }

  drawLabel(context) {
    context.font = this.labelFont;
    context.fillStyle = this.labelColor;
    context.fillText(this.edgeLabel, this.xText, this.yText);
    if (this.showTextCtrl) {
      context.fillStyle = 'red';
      context.beginPath();
      context.arc(this.xText, this.yText, 3.0, 0, 1.5 * Math.PI);
      context.lineTo(this.xText, this.yText);
      context.fill();
    }
  }

  updateTextLocation() {
    this.xText = this.bezierPoint.x;
    this.yText = this.bezierPoint.y;
  }

  // find the starting point of our text box
  generateDefaultTextLocation() {
    // var xOffSet = context.measureText(this.edgeLabel)/2;
    // var yOffSet = 1; //assuming an edge is just 1 pixel

    this.xText = this.bezierPoint.x;
    this.yText = this.bezierPoint.y;
    // console.log("Line xText: " + this.xText + ", yText: " + this.yText);
  }

}
