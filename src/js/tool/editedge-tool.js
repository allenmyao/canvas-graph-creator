import { Tool } from '../tool/tool';
import { Edge } from '../data/edge/edge';

export class EditEdgeTool extends Tool {

  name = 'Edit Edge Tool';

  currentMode = 'directed';
  static modes = {
    directed: 'isDirected'
  };

  optionMap = {
    directed: {
      label: 'isDirected'
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
    if (obj instanceof Edge) {
      this.selectNone(event, graph, x, y);
      let edgeAttribute = EditEdgeTool.modes[this.currentMode];
      obj[edgeAttribute] = !obj[edgeAttribute];
    }
  }

  dragOverObject(event, graph, obj, x, y) {
    if (obj instanceof Edge) {
      this.selectNone(event, graph, x, y);
      let edgeAttribute = EditEdgeTool.modes[this.currentMode];
      obj[edgeAttribute] = !obj[edgeAttribute];
    }
  }

}
