/* eslint no-unused-expressions: 0 */

import chai from 'chai';
let should = chai.should();

import { MoveTool } from '../../src/js/tool/move-tool';
import { Graph } from '../../src/js/data/graph';
import { CircleNode } from '../../src/js/data/node/circle-node';
import { SolidEdge } from '../../src/js/data/edge/solid-edge';

describe('MoveTool', () => {
  let moveTool;
  const x1 = 0;
  const y1 = 0;
  const x2 = 1000;
  const y2 = 0;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  let graph;
  let node1;
  let node2;
  let edge;

  beforeEach(() => {
    moveTool = new MoveTool();
    graph = new Graph();
    node1 = new CircleNode(x1, y1);
    node2 = new CircleNode(x2, y2);
    graph.addNode(node1);
    graph.addNode(node2);
    edge = new SolidEdge(node1, node2);
    graph.addEdge(edge);
  });

  describe('#constructor', () => {
    it('should create instance of MoveTool', () => {
      moveTool.should.be.instanceOf(MoveTool);
    });
  });

  describe('#dragObject', () => {
    it('should move node', () => {
      moveTool.dragObject(null, graph, node2, x2, y2, 1000, 1000);
      (node2.x).should.be.equal(1000);
      (node2.y).should.be.equal(1000);
    });

    it('should not move edge', () => {
      moveTool.dragObject(null, graph, edge, midX, midY, 1000, 1000);
      (node1.x).should.be.equal(x1);
      (node1.y).should.be.equal(y1);
      (node2.x).should.be.equal(x2);
      (node2.y).should.be.equal(y2);
    });
  });

  describe('#dropOnObject', () => {
    it('should not allow dropping on other nodes', () => {
      moveTool.dropOnObject(null, graph, node1, node2, x1, y1, x2, y2);
      if (x1 !== x2) {
        (node1.x).should.not.be.equal(x2);
      }
      if (y1 !== y2) {
        (node1.y).should.not.be.equal(y2);
      }
    });

    it('should move dragged node back to original position on drop failure', () => {
      moveTool.dropOnObject(null, graph, node1, node2, x1, y1, x2, y2);
      (node1.x).should.be.equal(x1);
      (node1.y).should.be.equal(y1);
    });

    it('should ignore collision with edges', () => {
      moveTool.dropOnObject(null, graph, node1, edge, x1, y1, midX, midY);
      (node1.x).should.be.equal(midX);
      (node1.y).should.be.equal(midY);
    });

    it('should not allow dropping non-node objects', () => {
      moveTool.dropOnObject(null, graph, edge, node1, midX, midY, x1, y1);
      (node1.x).should.be.equal(x1);
      (node1.y).should.be.equal(y1);
      (node2.x).should.be.equal(x2);
      (node2.y).should.be.equal(y2);
    });
  });

  describe('#dropOnNone', () => {
    it('should not allow collision with node', () => {
      // update node1 position
      node1.x = node2.x - node2.radius - node1.radius / 2;
      node1.y = node2.y;
      moveTool.dropOnNone(null, graph, node1, 0, 0, node2.x - node2.radius - node1.radius / 2, node2.y);

      (node1.x).should.be.equal(x1);
      (node1.y).should.be.equal(y1);
      (node2.x).should.be.equal(x2);
      (node2.y).should.be.equal(y2);
    });

    it('should ignore collision with edges', () => {
      let node3 = new CircleNode(0, -100);
      graph.addNode(node3);
      moveTool.dropOnNone(null, graph, node3, node3.x, node3.y, midX, midY + 1);

      (node3.x).should.be.equal(midX);
      (node3.y).should.be.equal(midY + 1);
    });
  });
});
