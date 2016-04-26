import Tool from '../tool/tool';
import Node from '../data/node/node';
import TraversalAlgorithm from '../algorithm/traversal-algorithm';
import ui from '../ui/ui';

class AlgorithmTool extends Tool {

  name = 'Algorithm Tool';
  sidebarType = 'algorithm';

  currentMode = 'traversal';
  static modes = {
    traversal: TraversalAlgorithm
  };

  optionMap = {
    traversal: {
      label: 'Traversal'
    }
  };

  optionContent = {
    html: '<span class="content"></span>',
    init: (optionElement, mode) => {
      let content = optionElement.querySelector('.content');
      content.textContent = this.optionMap[mode].label;
    }
  };

  changeMode(mode) {
    this.currentMode = mode;
    ui.sidebar.content.setAlgorithm(AlgorithmTool.modes[mode]);
  }

  selectObject(event, graph, obj, x, y) {
    if (obj instanceof Node) {
      ui.sidebar.content.selectObject(obj);
    }
  }

}

export { AlgorithmTool };
export default AlgorithmTool;
