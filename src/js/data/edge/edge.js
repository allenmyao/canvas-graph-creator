import { calcBezierDistance, EDGE_DISTANCE_THRESHOLD } from '../../util/curvedEdge';
import { CircleNode } from '../node/circle-node';

/*
* Edge Class
*   Represents an edge in the graph, and is also responsible for supplying draw functionality
*
*   Constructor accepts at least two parameters, startNode and destNode are mandatory, all others have default values, bezierPoint just becomes line midpoint
*
*   For the sake of organization and simplicity of use, try to only use the following members and functions
*   Doing so will ensure that this class is used as intended, and also that our code is clean and organized
*
*   startNode
*   destNode
*   bezierPoint - returns a {x:,y:} object
*   isDirected
*   weight - get and set functions have been overloaded to hide confusing internals, can be assigned a number or a grammar string, access as a data member ie edge.weight = blah or blah = edge.weight
*   getCostType() - returns whether or not this edge has a "Grammar", "Distance", or "None" type of cost associated with it
*   getEndpoints(reference) - reference can be a node or a number(1,2), returns associated endpoint as {x:,y:}
*   setEndpoints(reference, endpoint) - reference same as getEndpoints, enpoints must be a {x:,y:}
*
*   TODO:  implement better directed functionality, move in curvedEdge functionality
*/
export class Edge {

  static numEdges = 0;
  id = Edge.numEdges++;

  // graph data
  startNode;
  destNode;
  isDirected;

  // status
  isSelected = false;

  // label
  xText;
  yText;
  edgeLabel = '';
  labelFont = '14px Arial';
  labelColor = 'black';
  showTextCtrl = false;
  cost;
  costType;

  // appearance
  color = 'black';
  selectedColor = 'red';
  lineWidth = 1;

  constructor(startNode, destNode, bezierPoint = null, cost = null, isDirected = false) {
    let methods = [
      'draw'
    ];

    for (let method of methods) {
      if (typeof this[method] === 'undefined' || typeof this[method] !== 'function') {
        throw TypeError('Must override method: ' + method);
      }
    }

    if (arguments.length < 2) {
      throw Error(`Edge constructor requires at least two arguments: startNode and destNode. Actually passed in ${arguments}`);
    }
    this.costType = null;
    this.startNode = startNode;
    this.destNode = destNode;
    this.bezierPoint = bezierPoint;
    this.cost = cost;
    this.isDirected = isDirected;
    this.isSelected = false;
    this.partners = null;
    for (let edge of this.startNode.edges) {
      if (edge.startNode.id === this.startNode.id && edge.destNode.id === this.destNode.id) {
        this.partners = edge.partners.slice(0);
        break;
      } else if (edge.destNode.id === this.startNode.id && edge.startNode.id === this.destNode.id) {
        this.partners = edge.partners.slice(0);
        break;
      }
    }
    if (this.partners === null) {
      this.partners = [ this ];
    } else {
      for (let i = 0; i < this.partners.length; i++) {
        this.partners[i].partners[this.partners[i].partners.length] = this;
      }
      this.partners[this.partners.length] = this;
    }

    startNode.edges.add(this);
    destNode.edges.add(this);


    if (this.startNode.id === this.destNode.id) {
      let r = CircleNode.radius;
      this.startPoint = this.startNode.getAnglePoint(240);
      this.destPoint = this.startNode.getAnglePoint(300);
      this.bezierPoint = {
        x: (this.startPoint.x + this.destPoint.x) / 2,
        y: this.startPoint.y - 2 * r
      };
      this.isDirected = true;
    } else {
      let incline = Math.asin((this.destNode.y - this.startNode.y) / Math.sqrt((this.destNode.x - this.startNode.x) * (this.destNode.x - this.startNode.x) + (this.destNode.y - this.startNode.y) * (this.destNode.y - this.startNode.y)));
      incline = incline * 180 / Math.PI;
      if (this.startNode.x >= this.destNode.x) {
        incline = 180 - incline;
      }
      incline = (incline + 360) % 360;
      let numPartners = this.partners.length + 1;
      for (let i = 0; i < this.partners.length; i++) {
        let startAngle = incline + 90 * (i + 1) / numPartners - 45;
        let destAngle = incline + 225 - 90 * (i + 1) / numPartners;
        try {
          this.partners[i].startPoint = this.startNode.getAnglePoint(startAngle);
          this.partners[i].destPoint = this.destNode.getAnglePoint(destAngle);
        } catch (e) {
          return;
        }
        let orient = (i + 1) / numPartners - 0.5;
        let diff = {
          x: this.partners[i].destPoint.x - this.partners[i].startPoint.x,
          y: this.partners[i].destPoint.y - this.partners[i].startPoint.y
        };
        this.partners[i].bezierPoint = {
          x: (this.partners[i].startPoint.x + this.partners[i].destPoint.x) / 2 - orient * diff.y,
          y: (this.partners[i].startPoint.y + this.partners[i].destPoint.y) / 2 + orient * diff.x
        };
      }
    }

    if (typeof cost === 'string' || cost instanceof String) {
      this.costType = false;
    } else if (typeof cost === 'number') {
      this.costType = true;
    }

    this.generateDefaultTextLocation();
    this.showTextCtrl = false;
  }

  detach() {
    this.startNode.edges.delete(this);
    this.destNode.edges.delete(this);
    this.startNode = null;
    this.destNode = null;
  }

  getCostType() {
    if (this.costType === false) {
      return 'Grammar';
    } else if (this.costType === true) {
      return 'Distance';
    }
    return 'None';
  }

  set weight(cost) {
    if (typeof cost === 'string' || cost instanceof String) {
      this.costType = false;
      this.cost = cost;
    } else if (typeof cost === 'number') {
      this.costType = true;
      this.cost = cost;
    } else if (cost === null) {
      this.costType = null;
      this.cost = null;
    } else {
      throw Error('cost must be a s(S)tring or number');
    }
  }

  get weight() {
    return this.cost;
  }

  getEndpoints(reference) {
    if (reference === this.startNode || reference === 1) {
      return this.startPoint;
    } else if (reference === this.endNode || reference === 2) {
      return this.destPoint;
    }
  }

  setEndpoints(reference, endpoint) {
    if (reference === this.startNode || reference === 1) {
      this.startPoint = endpoint;
    } else if (reference === this.endNode || reference === 2) {
      this.destPoint = endpoint;
    }
  }

  updateEndpoints() {
    if (this.startNode.id === this.destNode.id) {
      let r = CircleNode.radius;
      this.startPoint = this.startNode.getAnglePoint(240);
      this.destPoint = this.startNode.getAnglePoint(300);
      this.bezierPoint = {
        x: (this.startPoint.x + this.destPoint.x) / 2,
        y: this.startPoint.y - 2 * r
      };
      this.isDirected = true;
    } else {
      let incline = Math.asin((this.destNode.y - this.startNode.y) / Math.sqrt((this.destNode.x - this.startNode.x) * (this.destNode.x - this.startNode.x) + (this.destNode.y - this.startNode.y) * (this.destNode.y - this.startNode.y)));
      incline = incline * 180 / Math.PI;
      if (this.startNode.x >= this.destNode.x) {
        incline = 180 - incline;
      }
      incline = (incline + 360) % 360;
      let numPartners = this.partners.length + 1;
      let multiIndex = -1;
      for (let i = 0; i < this.partners.length; i++) {
        if (this.partners[i].id === this.id) {
          multiIndex = i + 1;
          break;
        }
      }
      let startAngle = incline + 90 * multiIndex / numPartners - 45;
      let destAngle = incline + 225 - 90 * multiIndex / numPartners;
      try {
        this.startPoint = this.startNode.getAnglePoint(startAngle);
        this.destPoint = this.destNode.getAnglePoint(destAngle);
      } catch (e) {
        return;
      }
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

  // find the starting point of our text box
  generateDefaultTextLocation() {
    // var xOffSet = context.measureText(this.edgeLabel)/2;
    // var yOffSet = 1; //assuming an edge is just 1 pixel

    this.xText = this.bezierPoint.x;
    this.yText = this.bezierPoint.y;
    // console.log("Line xText: " + this.xText + ", yText: " + this.yText);
  }

}
