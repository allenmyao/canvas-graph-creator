import { Tool } from 'tool/tool';
import { Node } from 'data/node/node';
import { Edge } from 'data/edge/edge';
import * as Sidebar from 'ui/sidebar';

export class EraseTool extends Tool {

  name = 'Erase Tool';

  preSelectObject(event, graph, obj, x, y) {
    return true;
  }

  preDragObject(event, graph, srcObj, x, y) {
    return false;
  }

  selectObject(event, graph, obj, x, y) {
    if (obj instanceof Node) {
      graph.removeNode(obj);
    } else if (obj instanceof Edge) {
      graph.removeEdge(obj);
    }
    Sidebar.updateSidebar();
  }

  dragOverObject(event, graph, obj, x, y) {
    if (obj instanceof Node) {
      graph.removeNode(obj);
    } else if (obj instanceof Edge) {
      graph.removeEdge(obj);
    }
    Sidebar.updateSidebar();
  }

}
