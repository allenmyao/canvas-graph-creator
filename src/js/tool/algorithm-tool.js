import { Tool } from '../tool/tool';
import { Node } from '../data/node/node';
import TraversalAlgorithm from '../algorithm/traversal-algorithm';
import * as AlgorithmInterface from '../ui/algorithm';

export class AlgorithmTool extends Tool {

  name = 'Algorithm Tool';
  sidebarType = 'algorithm';

  currentMode = 'traversal';
  static modes = {
    traversal: TraversalAlgorithm
  };

  hasModes() {
    return true;
  }

  changeMode(mode) {
    this.currentMode = mode;
    AlgorithmInterface.setAlgorithm(AlgorithmTool.modes[mode]);
  }

  selectObject(event, graph, obj, x, y) {
    if (obj instanceof Node) {
      AlgorithmInterface.selectObject(obj);
    }
  }

}
