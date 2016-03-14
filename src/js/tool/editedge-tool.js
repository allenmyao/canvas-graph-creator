import { Tool } from 'tool/tool';
import { Edge } from 'data/edge/edge';

export class EditEdgeTool extends Tool {

  name = 'Edit Edge Tool';

  currentMode = 'directed';
  static modes = {
    directed: 'isDirected'
  };

  hasModes() {
    return true;
  }

  selectObject(event, graph, obj, x, y) {
    if (obj instanceof Edge) {
      this.selectNone(graph, x, y);
      let edgeAttribute = EditEdgeTool.modes[this.currentMode];
      obj[edgeAttribute] = !obj[edgeAttribute];
    }
  }

  dragOverObject(event, graph, obj, x, y) {
    if (obj instanceof Edge) {
      this.selectNone(graph, x, y);
      let edgeAttribute = EditEdgeTool.modes[this.currentMode];
      obj[edgeAttribute] = !obj[edgeAttribute];
    }
  }

}
