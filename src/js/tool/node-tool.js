import Tool from '../tool/tool';
import Node from '../data/node/node';
import CircleNode from '../data/node/circle-node';
import TriangleNode from '../data/node/triangle-node';
import SquareNode from '../data/node/square-node';
import DiamondNode from '../data/node/diamond-node';
import PentagonNode from '../data/node/pentagon-node';
import HexagonNode from '../data/node/hexagon-node';
import OctagonNode from '../data/node/octagon-node';

/**
 * Tool for adding nodes to the graph.
 * @class NodeTool
 */
class NodeTool extends Tool {

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
    html: '<canvas class="canvas-preview" width="50" height="50"></canvas>',
    init: (optionElement, mode) => {
      let canvas = optionElement.querySelector('canvas');
      let context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      let node = new NodeTool.modes[mode](25, 25);
      for (let field of Object.keys(this.inputs)) {
        node[field] = this.inputs[field];
      }
      node.radius = 15;
      node.draw(context);
    }
  };

  inputs = {
    isAcceptingState: false,
    isStartingState: false,
    radius: 30,
    color: '#000000',
    fillColor: '#ffffff',
    lineWidth: 1
  };

  inputTypes = [
    {
      type: 'boolean',
      name: 'isAcceptingState',
      displayName: 'Accepting State'
    },
    {
      type: 'boolean',
      name: 'isStartingState',
      displayName: 'Starting State'
    },
    {
      type: 'number',
      name: 'radius',
      displayName: 'Radius'
    },
    {
      type: 'color',
      name: 'color',
      displayName: 'Line Color'
    },
    {
      type: 'color',
      name: 'fillColor',
      displayName: 'Fill Color'
    },
    {
      type: 'number',
      name: 'lineWidth',
      displayName: 'Line Width'
    }
  ];

  /**
   * Handler for object selection. Attempts to create a node at the mouse's location.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {(Node|Edge|Label)} obj - Selected graph component.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   */
  selectObject(event, graph, obj, x, y) {
    if (!(obj instanceof Node)) {
      this.selectNone(event, graph, x, y);
    }
  }

  /**
   * Handler for clicking empty space. Attempts to create a node at the mouse's location.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   */
  selectNone(event, graph, x, y) {
    this.addNode(this.currentMode, graph, x, y);
  }

  /**
   * Handler for dropping object on empty space. The dropped object is ignored and attempts to create a node at the mouse's location.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {(Node|Edge|Label)} droppedObj - Dropped graph component.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   */
  dropOnNone(event, graph, droppedObj, x, y) {
    this.selectNone(event, graph, x, y);
  }

  /**
   * Helper function for creating a node can be added at the given position.
   * @param {string} mode - Name of the current mode.
   * @param  {Graph} graph - The current graph object.
   * @param  {number} x - x-coordinate (in canvas coordinates) of the point to create the node.
   * @param  {number} y - y-coordinate (in canvas coordinates) of the point to create the node.
   */
  addNode(mode, graph, x, y) {
    let NodeClass = NodeTool.modes[mode];
    let node = new NodeClass(x, y);
    for (let field of Object.keys(this.inputs)) {
      node[field] = this.inputs[field];
    }
    if (!graph.isNodeCollision(node, x, y)) {
      graph.addNode(node);
    }
  }

}

export { NodeTool };
export default NodeTool;
