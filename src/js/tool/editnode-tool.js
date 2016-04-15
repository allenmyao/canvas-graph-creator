import { Tool } from '../tool/tool';
import { Node } from '../data/node/node';

export class EditNodeTool extends Tool {

  name = 'Edit Node Tool';

  currentMode = 'acceptingState';
  static modes = {
    acceptingState: 'isAcceptingState',
    startState: 'isStartingState'
  };

  optionMap = {
    acceptingState: {
      label: 'isAcceptingState'
    },
    startState: {
      label: 'isStartingState'
    }
  };

  optionContent = {
    html: '<span class="content"></span>',
    init: (optionElement, mode) => {
      let content = optionElement.querySelector('.content');
      content.textContent = this.optionMap[mode].label;
    }
  };

  selectObject(event, graph, obj, x, y) {
    if (obj instanceof Node) {
      this.selectNone(event, graph, x, y);
      let nodeAttribute = EditNodeTool.modes[this.currentMode];
      obj[nodeAttribute] = !obj[nodeAttribute];
    }
  }

  dragOverObject(event, graph, obj, x, y) {
    if (obj instanceof Node) {
      this.selectNone(event, graph, x, y);
      let nodeAttribute = EditNodeTool.modes[this.currentMode];
      obj[nodeAttribute] = !obj[nodeAttribute];
    }
  }

}
