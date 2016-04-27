/* eslint-disable no-unused-expressions, max-nested-callbacks */

import chai from 'chai';
chai.should();

import Graph from '../../src/js/data/graph';
import Node from '../../src/js/data/node/circle-node';
import Edge from '../../src/js/data/edge/solid-edge';
import TraversalAlgorithm from '../../src/js/algorithm/traversal-algorithm';

describe('TraversalAlgorithm', () => {
  describe('#constructor()', () => {
    it('should create instance of TraversalAlgorithm', () => {
      let graph = new Graph();
      let algorithm = new TraversalAlgorithm(graph);
      algorithm.should.be.instanceof(TraversalAlgorithm);
    });
  });

  describe('#inputs', () => {
    it('should contain field named "source"', () => {
      let graph = new Graph();
      let algorithm = new TraversalAlgorithm(graph);
      (algorithm.inputs).should.have.property('source');
    });

    it('should require "source" to be a Node', () => {
      let graph = new Graph();
      let node1 = new Node(0, 0);
      let node2 = new Node(100, 100);
      let edge = new Edge(node1, node2);
      let algorithm = new TraversalAlgorithm(graph);

      let inputField = algorithm.inputTypes.filter((field) => field.name === 'source')[0];

      (inputField.test(node1)).should.be.true;
      (inputField.test(edge)).should.be.false;
      (inputField.test({})).should.be.false;
    });
  });

  describe('#visitNode()', () => {
    it('should mark node as visited in graphState', () => {
      let graph = new Graph();
      let node1 = new Node(0, 0);
      graph.addNode(node1);
      let algorithm = new TraversalAlgorithm(graph);

      algorithm.visitNode(node1);
      (algorithm.graphState.get(node1)).should.be.true;
    });

    it('should add adjacent edge to queue', () => {
      let graph = new Graph();
      let node1 = new Node(0, 0);
      let node2 = new Node(100, 100);
      graph.addNode(node1);
      graph.addNode(node2);
      let edge = new Edge(node1, node2);
      graph.addEdge(edge);
      let algorithm = new TraversalAlgorithm(graph);

      algorithm.visitNode(node1);
      (algorithm.next.has(edge)).should.be.true;
    });

    it('should add self-loop edges to queue', () => {
      let graph = new Graph();
      let node1 = new Node(0, 0);
      graph.addNode(node1);
      let edge2 = new Edge(node1, node1);
      graph.addEdge(edge2);
      let algorithm = new TraversalAlgorithm(graph);

      algorithm.visitNode(node1);
      (algorithm.next.has(edge2)).should.be.true;
    });

    it('should not add visited edges to queue', () => {
      let graph = new Graph();
      let node1 = new Node(0, 0);
      let node2 = new Node(100, 100);
      graph.addNode(node1);
      graph.addNode(node2);
      let edge = new Edge(node1, node2);
      graph.addEdge(edge);
      let algorithm = new TraversalAlgorithm(graph);

      algorithm.graphState.set(edge, true);
      algorithm.visitNode(node1);
      (algorithm.next.has(edge)).should.be.false;
    });
  });

  describe('#visitEdge()', () => {
    let graph;
    let node1;
    let node2;
    let edge;
    let algorithm;

    beforeEach(() => {
      graph = new Graph();
      node1 = new Node(0, 0);
      node2 = new Node(100, 100);
      graph.addNode(node1);
      graph.addNode(node2);
      edge = new Edge(node1, node2);
      graph.addEdge(edge);
      algorithm = new TraversalAlgorithm(graph);
    });

    it('should mark edge as visited in graphState', () => {
      algorithm.visitEdge(edge);
      (algorithm.graphState.get(edge)).should.be.true;
    });

    it('should add startNode to queue if unvisited and edge is not directed', () => {
      algorithm.graphState.set(node2, true);
      algorithm.visitEdge(edge);
      (algorithm.next.has(node1)).should.be.true;
    });

    it('should add only destNode to queue if unvisited and edge is directed', () => {
      edge.isDirected = true;
      algorithm.visitEdge(edge);
      (algorithm.next.has(node1)).should.be.false;
      (algorithm.next.has(node2)).should.be.true;
    });

    it('should not add visited nodes to queue', () => {
      algorithm.graphState.set(node1, true);
      algorithm.graphState.set(node2, true);
      algorithm.visitEdge(edge);
      (algorithm.next.has(node1)).should.be.false;
      (algorithm.next.has(node2)).should.be.false;
    });

    it('should handle self-loop edges', () => {
      let edge2 = new Edge(node1, node1);
      algorithm.visitEdge(edge2);
      (algorithm.graphState.get(edge2)).should.be.true;
    });
  });

  describe('#hasVisited()', () => {
    it('should return false if node has not been visited', () => {
      let graph = new Graph();
      let node1 = new Node(0, 0);
      graph.addNode(node1);
      let algorithm = new TraversalAlgorithm(graph);

      (algorithm.hasVisited(node1)).should.be.false;
    });

    it('should return false if edge has not been visited', () => {
      let graph = new Graph();
      let node1 = new Node(0, 0);
      let node2 = new Node(100, 100);
      graph.addNode(node1);
      graph.addNode(node2);
      let edge = new Edge(node1, node2);
      graph.addEdge(edge);
      let algorithm = new TraversalAlgorithm(graph);

      (algorithm.hasVisited(edge)).should.be.false;
    });

    it('should return true for node after calling visitNode on that node', () => {
      let graph = new Graph();
      let node1 = new Node(0, 0);
      graph.addNode(node1);
      let algorithm = new TraversalAlgorithm(graph);

      algorithm.visitNode(node1);
      (algorithm.hasVisited(node1)).should.be.true;
    });

    it('should return true for edge after calling visitEdge on that edge', () => {
      let graph = new Graph();
      let node1 = new Node(0, 0);
      let node2 = new Node(100, 100);
      graph.addNode(node1);
      graph.addNode(node2);
      let edge = new Edge(node1, node2);
      graph.addEdge(edge);
      let algorithm = new TraversalAlgorithm(graph);

      algorithm.visitEdge(edge);
      (algorithm.hasVisited(edge)).should.be.true;
    });
  });

  describe('#step()', () => {
    it('should throw error if next item is not Node or Edge', () => {
      let graph = new Graph();
      let node1 = new Node(0, 0);
      graph.addNode(node1);
      let algorithm = new TraversalAlgorithm(graph);

      (function () {
        algorithm.step();
      }).should.throw(Error);
    });

    it('should start from #source field object', () => {
      let graph = new Graph();
      let node1 = new Node(0, 0);
      graph.addNode(node1);
      let algorithm = new TraversalAlgorithm(graph);

      algorithm.source = node1;
      algorithm.step();
      (algorithm.isComplete).should.be.false;
    });

    it('should not mark algorithm as complete if it hasn\'t started yet', () => {
      let graph = new Graph();
      let node1 = new Node(0, 0);
      graph.addNode(node1);
      let algorithm = new TraversalAlgorithm(graph);

      algorithm.source = node1;
      algorithm.step();
      (algorithm.isComplete).should.be.false;
    });

    it('should mark algorithm as complete if queue is empty', () => {
      let graph = new Graph();
      let node1 = new Node(0, 0);
      graph.addNode(node1);
      let algorithm = new TraversalAlgorithm(graph);

      algorithm.source = node1;
      algorithm.step();
      algorithm.step();
      (algorithm.isComplete).should.be.true;
    });

    it('should return false if complete', () => {
      let graph = new Graph();
      let node1 = new Node(0, 0);
      graph.addNode(node1);
      let algorithm = new TraversalAlgorithm(graph);

      algorithm.source = node1;
      algorithm.step();
      (algorithm.step()).should.be.false;
    });

    it('should return true if not complete', () => {
      let graph = new Graph();
      let node1 = new Node(0, 0);
      graph.addNode(node1);
      let algorithm = new TraversalAlgorithm(graph);

      algorithm.source = node1;
      (algorithm.step()).should.be.true;
    });

    it('should call visitNode if next item is a node', () => {
      let graph = new Graph();
      let node1 = new Node(0, 0);
      graph.addNode(node1);
      let algorithm = new TraversalAlgorithm(graph);

      algorithm.source = node1;
      algorithm.step();
      (algorithm.hasVisited(node1)).should.be.true;
    });

    it('should call visitEdge if next item is an edge', () => {
      let graph = new Graph();
      let node1 = new Node(0, 0);
      let node2 = new Node(100, 100);
      graph.addNode(node1);
      graph.addNode(node2);
      let edge = new Edge(node1, node2);
      graph.addEdge(edge);
      let algorithm = new TraversalAlgorithm(graph);

      algorithm.source = node1;
      algorithm.step();
      algorithm.step();
      (algorithm.hasVisited(edge)).should.be.true;
    });
  });
});
