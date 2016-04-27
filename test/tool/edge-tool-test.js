import chai from 'chai';
let should = chai.should();

import EdgeTool from '../../src/js/tool/edge-tool';
import Graph from '../../src/js/data/graph';
import CircleNode from '../../src/js/data/node/circle-node';
import SolidEdge from '../../src/js/data/edge/solid-edge';

describe('EdgeTool', () => {
  let edgeTool;
  const x1 = 0;
  const y1 = 0;
  const x2 = 100;
  const y2 = 100;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  let graph;
  let node1;
  let node2;
  let edge;

  beforeEach(() => {
    edgeTool = new EdgeTool();
    graph = new Graph();
    node1 = new CircleNode(x1, y1);
    node2 = new CircleNode(x2, y2);
    graph.addNode(node1);
    graph.addNode(node2);
    edge = new SolidEdge(node1, node2);
    graph.addEdge(edge);
  });

  describe('#constructor', () => {
    it('should create instance of EdgeTool', () => {
      edgeTool.should.be.instanceOf(EdgeTool);
    });
  });

  describe('#hasModes', () => {
    it('should return true', () => {
      (edgeTool.hasModes()).should.be.true;
    });
  });

  describe('#selectObject', () => {
    it('should not select edges', () => {
      edgeTool.selectObject(null, graph, edge, midX, midY);
      should.not.exist(edgeTool.start);
    });

    it('should store node in "start"', () => {
      edgeTool.selectObject(null, graph, node1, x1, y1);
      (edgeTool.start).should.be.equal(node1);
    });

    it('should add edge if "start" node exists', () => {
      edgeTool.selectObject(null, graph, node1, x1, y1);
      edgeTool.selectObject(null, graph, node2, x2, y2);
      (graph.edges.size).should.be.equal(2);
    });

    it('should reset fields after adding edge', () => {
      edgeTool.selectObject(null, graph, node1, x1, y1);
      edgeTool.selectObject(null, graph, node2, x2, y2);
      should.not.exist(edgeTool.start);
      should.not.exist(edgeTool.dest);
    });
  });

  describe('#selectNone', () => {
    it('should do nothing if no node is selected', () => {
      edgeTool.selectNone(null, graph, null, null);
      should.not.exist(edgeTool.start);
      should.not.exist(edgeTool.dest);
    });

    it('should deselect nodes if selected', () => {
      edgeTool.selectObject(null, graph, node1, x1, y1);
      edgeTool.selectNone(null, graph, null, null);
      should.not.exist(edgeTool.start);
      should.not.exist(edgeTool.dest);
    });
  });

  describe('#cancel', () => {
    it('should cancel action by clearing fields', () => {
      edgeTool.selectObject(null, graph, node1, x1, y1);
      edgeTool.cancel();
      should.not.exist(edgeTool.start);
      should.not.exist(edgeTool.dest);
    });
  });
});
