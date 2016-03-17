import { Tool } from 'tool/tool';
import { Node } from 'data/node/node';
import { CircleNode } from 'data/node/circle-node';
import { SquareNode } from 'data/node/square-node';
import * as Sidebar from 'ui/sidebar';

export class NodeTool extends Tool {

  name = 'Node Tool';
  sidebarType = 'node';

  currentMode = 'circle';
  static modes = {
    circle: CircleNode,
    square: SquareNode
  };

  hasModes() {
    return true;
  }

  selectObject(graph, obj, x, y) {
    if (!(obj instanceof Node)) {
      this.selectNone(graph, x, y);
    }
  }

  selectNone(graph, x, y) {
    let NodeClass = NodeTool.modes[this.currentMode];
    let node = new NodeClass(x, y);
    if (!graph.isNodeCollision(node, x, y)) {
      graph.addNode(node);
    }
    Sidebar.updateSidebar();
  }

  dropOnNone(graph, droppedObj, startX, startY, x, y) {
    this.selectNone(graph, x, y);
  }

}
