import { calcBezierDistance, EDGE_DISTANCE_THRESHOLD } from '../../util/curvedEdge';
import { CircleNode } from '../node/circle-node';
import { SquareNode } from '../node/square-node';
import { Node } from '../node/node';

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
  id = Node.numEdges++;
  isSelected = false;
  edgeLabel = '';

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


    startNode.edges.add(this);
    destNode.edges.add(this);
    

    if (this.startNode.id === this.destNode.id) {
      if(this.startNode instanceof CircleNode) {
        let angle = 247.5;
        let theta = Math.PI * angle / 180;
        let r = CircleNode.radius;
        this.startPoint = {
          x: r*Math.cos(theta) + this.startNode.x,
          y: r*Math.sin(theta) + this.startNode.y
        };
        this.bezierPoint = {
          x: 4*r*Math.cos(theta + Math.PI / 8) + this.startNode.x,
          y: 4*r*Math.sin(theta + Math.PI / 8) + this.startNode.y
        };
        this.destPoint = {
          x: r*Math.cos(theta + Math.PI / 4) + this.startNode.x,
          y: r*Math.sin(theta + Math.PI / 4) + this.startNode.y
        };
      } else if(this.startNode instanceof SquareNode){
        let w = SquareNode.width;
        let hw = w/2;
        this.startPoint = {
          x: this.startNode.x - hw/2,
          y: this.startNode.y - hw
        };
        this.bezierPoint = {
          x: this.startNode.x,
          y: this.startNode.y - 2*w
        };
       this.destPoint = {
         x: this.startNode.x + hw/2,
         y: this.startNode.y - hw
       }
      }
      this.isDirected = true;
    } else {

      try {
        this.startPoint = this.startNode.edgePointInDirection(this.destNode.x, this.destNode.y);
        this.destPoint = this.destNode.edgePointInDirection(this.startNode.x, this.startNode.y);
      } catch (e) {
        return;
      }

      if (bezierPoint === null) {
        this.bezierPoint = {
          x: (this.startPoint.x + this.destPoint.x) / 2,
          y: (this.startPoint.y + this.destPoint.y) / 2
        };
      }
    }

    if (typeof cost === 'string' || cost instanceof String) {
      this.costType = false;
    } else if (typeof cost === 'number') {
      this.costType = true;
    }

    this.generateDefaultTextLocation();
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
      if(this.startNode instanceof CircleNode) {
        let angle = 247.5;
        let theta = Math.PI * angle / 180;
        let r = CircleNode.radius;
        this.startPoint = {
          x: r*Math.cos(theta) + this.startNode.x,
          y: r*Math.sin(theta) + this.startNode.y
        };
        this.bezierPoint = {
          x: 4*r*Math.cos(theta + Math.PI / 8) + this.startNode.x,
          y: 4*r*Math.sin(theta + Math.PI / 8) + this.startNode.y
        };
        this.destPoint = {
          x: r*Math.cos(theta + Math.PI / 4) + this.startNode.x,
          y: r*Math.sin(theta + Math.PI / 4) + this.startNode.y
        };
      } else if(this.startNode instanceof SquareNode){
        let w = SquareNode.width;
        let hw = w/2;
        this.startPoint = {
          x: this.startNode.x - hw/2,
          y: this.startNode.y - hw
        };
        this.bezierPoint = {
          x: this.startNode.x,
          y: this.startNode.y - 2*w
        };
       this.destPoint = {
         x: this.startNode.x + hw/2,
         y: this.startNode.y - hw
       }
      }
      this.isDirected = true;
    } else {
      try {
        this.startPoint = this.startNode.edgePointInDirection(this.destNode.x, this.destNode.y);
        this.destPoint = this.destNode.edgePointInDirection(this.startNode.x, this.startNode.y);
        this.bezierPoint = {
          x: (this.startPoint.x + this.destPoint.x) / 2,
          y: (this.startPoint.y + this.destPoint.y) / 2
        };
      } catch (e) {
        return;
      }
    }
  }

  containsPoint(x, y) {
    return EDGE_DISTANCE_THRESHOLD > calcBezierDistance(x, y, this.startPoint.x, this.startPoint.y, this.bezierPoint.x, this.bezierPoint.y, this.destPoint.x, this.destPoint.y);
  }

  draw(context) {
    throw Error('Can\'t call draw from abstract Edge class.');
  }

  //find the starting point of our text box
  generateDefaultTextLocation(){

    //var xOffSet = context.measureText(this.edgeLabel)/2;
    //var yOffSet = 1; //assuming an edge is just 1 pixel

    this.xText =  ((this.startPoint.x + this.destPoint.x) / 2) ;
    this.yText =  ((this.startPoint.y + this.destPoint.y) / 2) ;
  }

}
