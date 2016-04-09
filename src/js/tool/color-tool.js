import { Tool } from '../tool/tool';
import { Node } from '../data/node/node';
import { Edge } from '../data/edge/edge';

export class ColorTool extends Tool {

  name = 'Color Tool';

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