/**
 * Algorithm Class
 *    This superclass is intended to provide a common base interface for classes to implement visual emulation of algorithms.
 *    
 *    The algorithm that is being emulated runs once and precomputes all the graphical changes it will make, storing them in a timeline of Steps.
 *    Each Step is a bundle of visual changes that will occur together, with a descriptor describing what is happening in the step.
 *
 *    For ease of use the following members are designed specifically for front facing ease of use.  When extending this class, you should not need to use anything else.
 *
 *    graph - reference to the core graph structure of the application
 *    input - user defined input for the algorithm to run on
 * 
 *    nodePiece(originalNode, color, label) - requires originalNode, a reference to the node that is being changed visually, and optionally accepts the color and label you want it to change to
 *    edgePiece(originalEdge, color, label) - requires originalEdge, a reference to the edge that is being changed visually, and optionally accepts the color and label you want it to change to
 *    defineStep(descriptor) - takes all the calls to nodePiece and edgePiece since the construction of the class or the last defineStep call
 *                             and bundles them together into a single Step which is then added to the timeline.  Accepts an optional descriptor which describes
 *                             what is taking place during the step
 *    computeTimeline() - this is the method that you must override that will actually emulate the algorithm logically, and as you do so make calls to the above three methods
 *                        to accomodate your emulation with appropriate visual cues bundled in a understandable way
 *
 *    TODO:  finish implementing nodePiece and edgePiece classes; the edge and node classes have gotten to be a mess
 *           implement more safeguard logic in the class
 */

class Step {
  this.nodePieces = new Set();
  this.edgePieces = new Set();
  this.descriptor = "";
  
  addNodePiece(nodePiece) {
    this.nodePieces.add(nodePiece);
  }
  
  addEdgePiece(edgePiece) {
    this.edgePieces.add(edgePiece);
  }
}

class Piece {
  constructor(original, newer) {
    this.original = original;
    this.newer = newer;
  }
}

export class Abstract {
  constructor(graph, input) {
    let methods = [
      'computeTimeline'
    ];

    for (let method of methods) {
      if (typeof this[method] === 'undefined' || typeof this[method] !== 'function') {
        throw TypeError('Must override method: ' + method);
      }
    }
    
    this.graph = graph;
    this.input = input;
    this.timeline = [];
    this.curStep = -1;
    this.tmpStep = new Step();
  }

  nextStep() {
    if(curStep.equals(timeline.length - 1)) {
      return "Out of bounds";
    }
    let tmp = this.timeline[this.curStep+1];
    for(let piece in tmp.nodePieces) {
      graph.nodes.delete(piece.original);
      graph.nodes.add(piece.newer);
    }
    for(let piece in tmp.edgePieces) {
      graph.edges.delete(piece.original);
      graph.edges.add(piece.newer);      
    }
    curStep = curStep + 1;
    return tmp.descriptor;
  }

  backStep() {
    if(curStep.equals(-1)) {
      return "Out of bounds";
    }
    let tmp = this.timeline[this.curStep];
    for(let piece in tmp.nodePieces) {
      graph.nodes.delete(piece.newer);
      graph.nodes.add(piece.original);
    }
    for(let piece in tmp.edgePieces) {
      graph.edges.delete(piece.newer);
      graph.edges.add(piece.original);      
    }
    curStep = curStep - 1;
    if(curStep == -1) {
      return "Algorithm ready to start!"
    } else {
      return this.timeline[this.curStep].descriptor; 
    }
  }
  
  defineStep(descriptor) {
    this.tmpStep.descriptor = descriptor;
    timeline.add(tmpStep);
    tmpStep = new Step();
  }
  
  nodePiece(originalNode, color, label) {
    tmpStep.addNodePiece(new Piece(originalNode,originalNode));//TODO:  find way to clone objects?
  }
  
  edgePiece(originalEdge, color, label) {
    tmpStep.addEdgePiece(new Piece(originalEdge,originalNode));//TODO:  find way to clone objects?
  }
  
  computeTimeline() {
    throw Error('Can\'t call computeTimeline from abstract Algorithm class.');
  }

}
