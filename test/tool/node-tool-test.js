import chai from 'chai';
chai.should();

import NodeTool from '../../src/js/tool/node-tool';
import Graph from '../../src/js/data/graph';
import CircleNode from '../../src/js/data/node/circle-node';
import SolidEdge from '../../src/js/data/edge/solid-edge';

describe('NodeTool', () => {
  let nodeTool;
  let graph;

  beforeEach(() => {
    nodeTool = new NodeTool();
    graph = new Graph();
  });

  describe('#constructor', () => {
    it('should create instance of NodeTool', () => {
      nodeTool.should.be.instanceOf(NodeTool);
    });
  });

  describe('#hasModes', () => {
    it('should return true', () => {
      (nodeTool.hasModes()).should.be.true;
    });
  });

  describe('#selectObject', () => {
    it('should not add a node on another node', () => {
      let node = new CircleNode(0, 0);
      graph.addNode(node);
      nodeTool.selectObject(null, graph, node, 0, 0);

      (graph.nodes.size).should.be.equal(1);
    });

    it('should add node if object is an edge', () => {
      let node1 = new CircleNode(0, 0);
      let node2 = new CircleNode(node1.radius * 6, 0);
      node2.radius = node1.radius;
      graph.addNode(node1);
      graph.addNode(node2);

      let edge = new SolidEdge(node1, node2);
      graph.addEdge(edge);

      nodeTool.selectObject(null, graph, edge, node1.radius * 3, 0);
      (graph.nodes.size).should.be.equal(3);
    });

    // it('should not add node if object is an edge over a node', () => {
    //   // TODO implement this
    //   console.log('Not implemented yet');
    // });
  });

  describe('#selectNone', () => {
    it('should add node if no collisions detected', () => {
      nodeTool.selectNone(null, graph, 0, 0);
      (graph.nodes.size).should.be.equal(1);
    });

    it('should not add node if colliding with another node', () => {
      let node = new CircleNode(0, 0);
      let radius = node.radius;
      graph.addNode(node);

      nodeTool.selectNone(null, graph, radius + 1, 0);
      (graph.nodes.size).should.be.equal(1);
    });
  });

  // should do same thing as selectNone
  describe('#dropOnNone', () => {
    it('should add node if no collisions detected', () => {
      nodeTool.dropOnNone(null, graph, null, 0, 0, 0, 0);
      (graph.nodes.size).should.be.equal(1);
    });

    it('should not add node if colliding with another node', () => {
      let node = new CircleNode(0, 0);
      let radius = node.radius;
      graph.addNode(node);

      nodeTool.dropOnNone(null, graph, null, 0, 0, radius + 1, 0);
      (graph.nodes.size).should.be.equal(1);
    });
  });
});
