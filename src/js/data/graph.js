class Graph {
  constructor(nodes, edges) {
    this.nodes = new Set(nodes);
    this.edges = new Set(edges);
  }

  addNode(node) {
    this.nodes.add(node);
  }

  addEdge(edge) {
    if (!this.nodes.has(edge.startNode) || !this.nodes.has(edge.destNode)) {
      throw new Error('Edge nodes are not in the graph');
    }
    this.edges.add(edge);
  }

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

  hasComponent(x, y, ignore) {
    let component = this.getComponent(x, y);
    return component !== ignore && component !== null;
  }

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

  forEachNode(callback) {
    for (let node of this.nodes) {
      if (callback(node) === false) {
        break;
      }
    }
  }

  forEachEdge(callback) {
    for (let edge of this.edges) {
      if (callback(edge) === false) {
        break;
      }
    }
  }

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
