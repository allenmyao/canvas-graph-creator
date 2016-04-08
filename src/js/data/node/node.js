export class Node {
  static numNodes = 0;

  id = Node.numNodes++;
  edges = new Set();
  isSelected = false;
  nodeLabel = ''; // string the label of the node; changed name to nodeLabel - Athanasios 3/15/16
  outline = '#000000'; // string Format as hex Color
  fill = '#FFFFFF'; // string Format as hex Color
  lineWidth = 1; // numerical value for thickenss of line
  isAcceptingState = false;  // boolean for DFA/NFA purposes, indicated by double circle
  isStartingState = false;  // boolean for DFA/NFA purposes, idicated by incoming arrow
  value = 0; // numerical value for algorithms
  visited = false; // boolean used for algorithms e.x traversals.
  color='black'; // string value defines the color for chromatic algorithms
  xText = 0;
  yText = 0;
  showTextCtrl = false;


  constructor(x, y) {
    // new.target not supported by Babel
    // if (new.target === Node) {
    //     throw TypeError('Node class is abstract; cannot construct Node instances directly');
    // }

    let methods = [
      'containsPoint',
      'distanceToPoint',
      'edgePointInDirection',
      'draw'
    ];

    for (let method of methods) {
      if (typeof this[method] === 'undefined' || typeof this[method] !== 'function') {
        throw TypeError('Must override method: ' + method);
      }
    }

    if (typeof x === 'undefined' || typeof y === 'undefined') {
      throw Error(`Node constructor requires two arguments: x, y. Actually passed in: ${x}, ${y}`);
    }
    this.x = x;
    this.y = y;
  }

  setPos(x, y) {
    this.xText += (x - this.x);
    this.yText += (y - this.y);
    this.x = x;
    this.y = y;
    for (let edge of this.edges) {
      edge.updateEndpoints();
    }
  }

  containsPoint(x, y) {
    throw Error('Can\'t call methods from abstract Node class.');
  }

  distanceToPoint(x, y) {
    throw Error('Can\'t call methods from abstract Node class.');
  }

  // rename to closestPointTo
  // modify to find closest point to another node
  edgePointInDirection(x, y) {
    throw Error('Can\'t call methods from abstract Node class.');
  }

  draw(context) {
    throw Error('Can\'t call methods from abstract Node class.');
  }

  // find the starting point of our text box
  generateDefaultTextLocation() {}

}
