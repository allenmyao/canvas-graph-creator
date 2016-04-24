class Node {

  static numNodes = 0;
  id = Node.numNodes++;

  // graph data
  x;
  y;
  edges = new Set();
  isAcceptingState = false;  // boolean for DFA/NFA purposes, indicated by double circle
  isStartingState = false;  // boolean for DFA/NFA purposes, idicated by incoming arrow

  // status
  isSelected = false;

  // label
  label;

  // appearance
  color = '#000000'; // string Format as hex Color
  fillColor = '#FFFFFF'; // string Format as hex Color
  selectedColor = '#FF0000';
  lineWidth = 1; // numerical value for thickenss of line

  constructor(x, y) {
    // new.target not supported by Babel
    // if (new.target === Node) {
    //     throw TypeError('Node class is abstract; cannot construct Node instances directly');
    // }

    let methods = [
      'containsPoint',
      'distanceToPoint',
      'edgePointInDirection',
      'draw',
      'getAnglePoint'
    ];

    for (let method of methods) {
      if (typeof this[method] !== 'function') {
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
    this.label.x += (x - this.x);
    this.label.y += (y - this.y);
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

  edgePointInDirection(x, y) {
    throw Error('Can\'t call methods from abstract Node class.');
  }

  draw(context) {
    throw Error('Can\'t call methods from abstract Node class.');
  }

  getAnglePoint(context) {
    throw Error('Can\'t call methods from abstract Node class.');
  }

  drawLabel(context) {
    this.label.draw(context);
  }

}

export { Node };
export default Node;
