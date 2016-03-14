import { Tool } from 'tool/tool';
import { Node } from 'data/node/node';

export class EditNodeTool extends Tool {

  name = 'Edit Node Tool';

  currentMode = 'acceptingState';
  static modes = {
    acceptingState: 'isAcceptingState',
    startState: 'isStartingState'
  };

  hasModes() {
    return true;
  }

  selectObject(event, graph, obj, x, y) {
    if (obj instanceof Node) {
      this.selectNone(graph, x, y);
      let nodeAttribute = EditNodeTool.modes[this.currentMode];
      obj[nodeAttribute] = !obj[nodeAttribute];
    }
  }

  dragOverObject(event, graph, obj, x, y) {
    if (obj instanceof Node) {
      this.selectNone(graph, x, y);
      let nodeAttribute = EditNodeTool.modes[this.currentMode];
      obj[nodeAttribute] = !obj[nodeAttribute];
    }
  }

}
