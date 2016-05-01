import Tool from '../tool/tool';
import Node from '../data/node/node';
import SolidEdge from '../data/edge/solid-edge';
import DashedEdge from '../data/edge/dashed-edge';
import CircleNode from '../data/node/circle-node';

/**
 * Tool for adding edges to the graph.
 * @class EdgeTool
 */
class EdgeTool extends Tool {

  currentMode = 'solid';
  static modes = {
    solid: SolidEdge,
    dashed: DashedEdge
  };

  optionMap = {
    solid: {
      label: 'Solid'
    },
    dashed: {
      label: 'Dashed'
    }
  };

  optionContent = {
    html: '<canvas class="canvas-preview" width="50" height="50"></canvas>',
    init: (optionElement, mode) => {
      let canvas = optionElement.querySelector('canvas');
      let context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      let node1 = new CircleNode(12.5, 37.5);
      let node2 = new CircleNode(37.5, 12.5);
      let edge = new EdgeTool.modes[mode](node1, node2);
      for (let field of Object.keys(this.inputs)) {
        edge[field] = this.inputs[field];
      }
      edge.draw(context);
    }
  };

  inputs = {
    isDirected: false,
    color: '#000000',
    lineWidth: 1
  };

  inputTypes = [
    {
      type: 'boolean',
      name: 'isDirected',
      displayName: 'Directed'
    },
    {
      type: 'color',
      name: 'color',
      displayName: 'Color'
    },
    {
      type: 'number',
      name: 'lineWidth',
      displayName: 'Width'
    }
  ];

  start = null;
  dest = null;

  /**
   * Cancel any
   * @override
   */
  cancel() {
    this.deselect();
  }

  /**
   * Deselect the selected node (if any).
   */
  deselect() {
    if (this.start) {
      this.start.isSelected = false;
    }
    this.start = null;
    this.dest = null;
  }

  /**
   * Called when a node is selected. Determines whether an edge should be added or not.
   * @param  {Graph} graph - The current Graph object.
   * @param  {Node} node - The selected node.
   */
  selectNode(graph, node) {
    let EdgeClass = EdgeTool.modes[this.currentMode];
    if (this.start === null) {
      this.start = node;
      this.start.isSelected = true;
    } else {
      this.dest = node;
      if (this.start.id === this.dest.id) {
        // check for existing self-loop
        for (let edge of this.start.edges) {
          if (edge.startNode.id === edge.destNode.id) {
            this.dest = null;
            return;
          }
        }
      }
      let edge = new EdgeClass(this.start, this.dest);
      for (let field of Object.keys(this.inputs)) {
        if (field === 'isDirected' && this.start === this.dest) {
          continue;
        }
        edge[field] = this.inputs[field];
      }
      graph.addEdge(edge);
      this.start.isSelected = false;
      this.start = null;
      this.dest = null;
    }
  }

  /**
   * Handler for object selection. For this tool, only nodes can be selected. When a second node is selected, an edge is created and the tool state is reset.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {(Node|Edge|Label)} obj - Selected graph component.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   * @override
   */
  selectObject(event, graph, obj, x, y) {
    if (obj instanceof Node) {
      this.selectNode(graph, obj);
    }
  }

  /**
   * Handler for clicking empty space. Deselect any selected nodes.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   * @override
   */
  selectNone(event, graph, x, y) {
    this.deselect();
  }

}

export { EdgeTool };
export default EdgeTool;
