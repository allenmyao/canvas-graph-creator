export class Edge {
  
  constructor(startNode, destNode, bezierPoint = null, cost = null, isDirected = false) {
    let methods = [
      'draw'
    ];

    for (let method of methods) {
      if (this[method] === undefined || typeof this[method] !== 'function') {
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
    
    try {
      this.startPoint = this.startNode.edgePointInDirection(this.destNode.x, this.destNode.y);
      this.destPoint = this.destNode.edgePointInDirection(this.startNode.x, this.startNode.y);
    } catch (e) {
      return;
    }
  
    if(bezierPoint === null) {
      bezierPoint = {
          x: (this.startPoint.x + this.destPoint.x)/2,
          y: (this.startPoint.y + this.destPoint.y)/2
        };
    }
    
    if(typeof cost === 'string' || cost instanceof String) {
      costType = false;
    } else if(typeof cost === 'number') {
      costType = true;
    }
  }

  containsPoint(x, y) {
    // TODO: implement this
    return false;
  }
  
  draw(context) {
    context.strokeStyle = 'black';

    // Create a new path
    context.beginPath();

    // Start path at given point
    context.moveTo(this.startPoint.x, this.startPoint.y);

    // Draw line to given point
    context.lineTo(this.destPoint.x, this.destPoint.y);

    // Draw to the canvas
    context.stroke();
  }

}
