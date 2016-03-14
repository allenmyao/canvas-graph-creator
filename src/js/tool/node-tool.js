import { Tool } from 'tool/tool';
import { Node } from 'data/node/node';
import { CircleNode } from 'data/node/circle-node';
import { SquareNode } from 'data/node/square-node';

export class NodeTool extends Tool {

  name = 'Node Tool';

  currentMode = 'circle';
  static modes = {
    circle: CircleNode,
    square: SquareNode
  };

  hasModes() {
    return true;
  }

  selectObject(event, graph, obj, x, y) {
    if (!(obj instanceof Node)) {
      this.selectNone(graph, x, y);
    }
  }

  selectNone(event, graph, x, y) {
    let NodeClass = NodeTool.modes[this.currentMode];
    let node = new NodeClass(x, y);
    if (!graph.isNodeCollision(node, x, y)) {
      graph.addNode(node);
    }
  }

  dropOnNone(event, graph, droppedObj, startX, startY, x, y) {
    this.selectNone(graph, x, y);
  }

}
