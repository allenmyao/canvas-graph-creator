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

  optionMap = {
    circle: {
      label: 'Circle'
    },
    triangle: {
      label: 'Triangle'
    },
    square: {
      label: 'Square'
    },
    diamond: {
      label: 'Diamond'
    },
    pentagon: {
      label: 'Pentagon'
    },
    hexagon: {
      label: 'Hexagon'
    },
    octagon: {
      label: 'Octagon'
    }
  };

  optionContent = {
    html: '<canvas  class="canvas-preview" width="50" height="50"></canvas>',
    init: (optionElement, mode) => {
      let canvas = optionElement.querySelector('canvas');
      let context = canvas.getContext('2d');
      let node = new NodeTool.modes[mode](25, 25);
      node.radius = 15;
      // TODO: get other input values for default node properties
      node.draw(context);
    }
  };

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
