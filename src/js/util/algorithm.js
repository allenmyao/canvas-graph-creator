import defaultMember from "\src\js\util\queue.js";
import "\src\js\util\graphLogic.js";
import "\src\js\util\graphVisuals.js";

export class Abstract() {  
  constructor(graph, input) {
    this.queue = new Queue();
    this.graph = graph;
    this.input = input;
    this.curNode = null;
  }
  
  nextStep() {
    
  }
  
  backStep() {
    
  }
  
  
}