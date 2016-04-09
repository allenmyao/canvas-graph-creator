import { Tool } from '../tool/tool';
import { Node } from '../data/node/node';
import { CircleNode } from '../data/node/circle-node';
import { SquareNode } from '../data/node/square-node';
import { TriangleNode } from '../data/node/triangle-node';
import { DiamondNode } from '../data/node/diamond-node';
import { PentagonNode } from '../data/node/pentagon-node';
import { HexagonNode } from '../data/node/hexagon-node';
import { OctagonNode } from '../data/node/octagon-node';

export class NodeTool extends Tool {

  name = 'Node Tool';
  sidebarType = 'node';

  currentMode = 'circle';
  static modes = {
    circle: CircleNode,
    triangle: TriangleNode,
    square: SquareNode,
    diamond: DiamondNode,
    pentagon: PentagonNode,
    hexagon: HexagonNode,
    octagon: OctagonNode
  };

  hasModes() {
    return true;
  }

  selectObject(event, graph, obj, x, y) {
    if (!(obj instanceof Node)) {
      this.selectNone(event, graph, x, y);
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
    this.selectNone(event, graph, x, y);
  }

}
