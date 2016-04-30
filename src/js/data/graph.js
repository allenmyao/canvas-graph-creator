import Node from '../data/node/node';
import Edge from '../data/edge/edge';
import Label from '../data/label';

/**
 * Data representation of a graph.
 * @class Graph
 */
class Graph {

  /**
   * Constructs a Graph instance.
   * @param  {Set.<Node>} nodes - Iterable containing nodes to add.
   * @param  {Set.<Edge>} edges - Iterable containing edges to add.
   * @constructs Graph
   */
  constructor(nodes, edges) {
    this.nodes = new Set(nodes);
    this.edges = new Set(edges);
  }

  /**
   * Validate the graph. Called to check if imported graph is valid.
   * @return {boolean} - Whether or not the graph is valid.
   */
  validate() {
    if (!(this.nodes instanceof Set) || !(this.edges instanceof Set)) {
      return false;
    }
    for (let node of this.nodes) {
      if (!(node instanceof Node) || !(node.id >= 0)) {
        return false;
      }
      if (node.label !== null && !(node.label instanceof Label)) {
        return false;
      }
    }

    for (let edge of this.edges) {
      if (!(edge instanceof Edge) || !(edge.id >= 0)) {
        return false;
      }
      if (edge.label !== null && !(edge.label instanceof Label)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Add a node to the graph.
   * @param {Node} node - The node to add.
   */
  addNode(node) {
    this.nodes.add(node);
  }

  /**
   * Add an edge to the graph.
   * @param {Edge} edge - The edge to add.
   */
  addEdge(edge) {
    if (!this.nodes.has(edge.startNode) || !this.nodes.has(edge.destNode)) {
      throw new Error('Edge nodes are not in the graph');
    }
    this.edges.add(edge);
  }

  /**
   * Remove a node from the graph.
   * @param  {Node} node - The node to remove.
   */
  removeNode(node) {
    // Temp copy of edges to work on while we remove them
    let tempEdges = new Set();
    for (let edge of node.edges) {
      tempEdges.add(edge);
    }
    for (let edge of tempEdges) {
      this.removeEdge(edge);
    }
    this.nodes.delete(node);
  }

  /**
   * Remove an edge from the graph.
   * @param  {Edge} edge - The edge to remove.
   */
  removeEdge(edge) {
    let id = edge.id;
    for (let i = 0; i < edge.partners.length; i++) {
      for (let j = 0; j < edge.partners[i].length; j++) {
        if (edge.partners[i].partners[j].id === id) {
          edge.partners[i].partners.splice(j, 1);
          edge.partners[i].updateEndpoints();
          break;
        }
      }
    }
    this.edges.delete(edge);
    edge.detach();
  }

  /**
   * Check if the graph has an edge from start to dest.
   * @param  {Node}  start - The start node.
   * @param  {Node}  dest - The dest node.
   * @return {boolean} - Whether or not the graph contains an edge from start to dest.
   */
  hasEdge(start, dest) {
    if (!this.nodes.has(start) || !this.nodes.has(dest)) {
      throw new Error('Nodes are not in the graph');
    }

    for (let edge of this.edges) {
      if (edge.startNode === start && edge.destNode === dest) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if the graph has a component at the given point.
   * @param  {number} x - x-coordinate of the point.
   * @param  {number} y - y-coordinate of the point.
   * @param  {(Node|Edge|Label)}  ignore - Object to ignore checking. This is to prevent returning true when dragging items.
   * @return {boolean} - Whether or not the graph has a component at the point.
   */
  hasComponent(x, y, ignore) {
    let component = this.getComponent(x, y);
    return component !== ignore && component !== null;
  }

  /**
   * Get the graph component at the given point, if it exists. If multiple objects overlap, the priority is (highest to lowest): Label, Node, Edge.
   * @param  {number} x - x-coordinate of the point.
   * @param  {number} y - y-coordinate of the point.
   * @return {(Node|Edge|Label)} - Object at the given point if it exists, null otherwise.
   */
  getComponent(x, y) {
    for (let node of this.nodes) {
      if (node.label.containsPoint(x, y)) {
        return node.label;
      }
    }

    for (let edge of this.edges) {
      if (edge.label.containsPoint(x, y)) {
        return edge.label;
      }
    }

    for (let node of this.nodes) {
      if (node.containsPoint(x, y)) {
        return node;
      }
    }

    for (let edge of this.edges) {
      if (edge.containsPoint(x, y)) {
        return edge;
      }
    }

    return null;
  }

  /**
   * Checks if there is a node collision by moving a node
   * @param  {Node} testNode - The node to check collisions for.
   * @param  {number} x - x-coordinate of the node.
   * @param  {number} y - y-coordinate of the node.
   * @return {boolean} - Whether or not there is a collision.
   */
  isNodeCollision(testNode, x, y) {
    let collision = false;
    this.forEachNode((node) => {
      if (node === testNode) {
        return true;
      }
      let nodePoint = node.edgePointInDirection(x, y);
      let testPoint = testNode.edgePointInDirection(node.x, node.y);
      if (testNode.containsPoint(nodePoint.x, nodePoint.y)
          || node.containsPoint(testPoint.x, testPoint.y)) {
        collision = true;
        return false;
      }
      return true;
    });
    return collision;
  }

  /**
   * Iterator for all graph nodes. Remaining nodes are skipped if the callback returns false.
   * @param {function(node: Node): boolean} callback - Called once for each node, with the node as a parameter. Return false to skip remaining nodes.
   */
  forEachNode(callback) {
    for (let node of this.nodes) {
      if (callback(node) === false) {
        break;
      }
    }
  }

  /**
   * Iterator for all graph edges. Remaining edges are skipped if the callback returns false.
   * @param {function(edge: Edge): boolean} callback - Called once for each edge, with the edge as a parameter. Return false to skip remaining edges.
   */
  forEachEdge(callback) {
    for (let edge of this.edges) {
      if (callback(edge) === false) {
        break;
      }
    }
  }

  /**
   * Draw the graph on the given canvas context.
   * @param  {CanvasRenderingContext2D} context - Canvas 2D context.
   */
  draw(context) {
    this.edges.forEach((edge) => {
      edge.draw(context);
    });

    this.nodes.forEach((node) => {
      node.draw(context);
    });
  }
}

export { Graph };
export default Graph;
