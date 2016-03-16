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
  color=''; // string value defines the color for chromatic algorithms
  xText = 0;
  yText = 0;


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

    if (arguments.length < 2) {
      throw Error(`Node constructor requires two arguments: x, y. Actually passed in ${arguments}`);
    }
    this.x = x;
    this.y = y;
    this.generateDefaultTextLocation();
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


  //find the starting point of our text box
  generateDefaultTextLocation(){



    this.xText = this.x + this.radius + 4;
    this.yText = this.y; 
  }

}
