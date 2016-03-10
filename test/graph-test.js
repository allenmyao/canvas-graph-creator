import chai from 'chai';
chai.should();

import { Graph } from '../src/js/data/graph';
import { Node } from '../src/js/data/node/node';
import { Edge } from '../src/js/data/edge/edge';

describe('Graph', () => {

  describe('#constructor(x, y)', () => {

    it('should accept iterable arguments', () => {
      let node1 = new Node(0, 0);
      let node2 = new Node(1, 0);
      let edge1 = new Edge(node1, node2);

      let nodes = new Set();
      nodes.add(node1);
      nodes.add(node2);

      let edges = new Set();
      edges.add(edge1);

      let graph = new Graph(nodes, edges);
      graph.nodes.size.should.equal(2);
      graph.edges.size.should.equal(1);
    });

    it('should work with no arguments', () => {
      let graph = new Graph();
      graph.nodes.size.should.equal(0);
      graph.edges.size.should.equal(0);
    });

  }); // #constructor(x, y)

  describe('#addNode(node)', () => {

    it('should add to nodes', () => {
      let graph = new Graph();
      let node = new Node(0, 0);
      graph.nodes.size.should.equal(0);
      graph.addNode(node);
      graph.nodes.size.should.equal(1);
    });

    it('should not add duplicate node', () => {
      let graph = new Graph();
      let node = new Node(0, 0);
      graph.nodes.size.should.equal(0);
      graph.addNode(node);
      graph.nodes.size.should.equal(1);
      graph.addNode(node);
      graph.nodes.size.should.equal(1);
    });

  }); // #addNode(node)

  describe('removeNode(node)', () => {

    it('should remove from nodes', () => {
      let graph = new Graph();
      let node = new Node(0, 0);
      graph.nodes.size.should.equal(0);
      graph.addNode(node);
      graph.nodes.size.should.equal(1);
      graph.removeNode(node);
      graph.nodes.size.should.equal(0);
    });

    it('should remove from nodes and edges', () => {
      let graph = new Graph();
      let node1 = new Node(0, 0);
      let node2 = new Node(128, 128);
      graph.nodes.size.should.equal(0);
      graph.addNode(node1);
      graph.addNode(node2);
      graph.nodes.size.should.equal(2);
      graph.edges.size.should.equal(0);
      let edge = new Edge(node1, node2);
      graph.addEdge(edge);
      graph.edges.size.should.equal(1);
      graph.removeNode(node2);
      graph.nodes.size.should.equal(1);
      graph.edges.size.should.equal(0);
    });

    it('should not remove bogus node', () => {
      let graph = new Graph();
      let node = new Node(0, 0);
      let badNode = new Node(128, 128);
      graph.nodes.size.should.equal(0);
      graph.addNode(node);
      graph.nodes.size.should.equal(1);
      graph.removeNode(badNode);
      graph.nodes.size.should.equal(1);
    });

  }); // #removeNode(node)

  describe('#addEdge(edge)', () => {

    it('should throw error when edge nodes are not in graph', () => {
      let graph = new Graph();
      let edge = new Edge(new Node(0, 0), new Node(1, 0));
      graph.edges.size.should.equal(0);
      (function() {
        graph.addEdge(edge);
      }).should.throw(Error);
    });

    it('should add to edges', () => {
      let graph = new Graph();
      let start = new Node(0, 0);
      let dest = new Node(100, 0);
      graph.addNode(start);
      graph.addNode(dest);
      let edge = new Edge(start, dest);
      graph.edges.size.should.equal(0);
      graph.addEdge(edge);
      graph.edges.size.should.equal(1);
    });

    it('should not add duplicate edge', () => {
      let graph = new Graph();
      let start = new Node(0, 0);
      let dest = new Node(100, 0);
      graph.addNode(start);
      graph.addNode(dest);
      let edge = new Edge(start, dest);
      graph.edges.size.should.equal(0);
      graph.addEdge(edge);
      graph.edges.size.should.equal(1);
      graph.addEdge(edge);
      graph.edges.size.should.equal(1);
    });

  }); // #addEdge(edge)

  describe('removeEdge(edge)', () => {

    it('should remove from edges', () => {
      let graph = new Graph();
      let node1 = new Node(0, 0);
      let node2 = new Node(128, 128);
      graph.nodes.size.should.equal(0);
      graph.addNode(node1);
      graph.addNode(node2);
      graph.nodes.size.should.equal(2);
      graph.edges.size.should.equal(0);
      let edge = new Edge(node1, node2);
      graph.addEdge(edge);
      graph.edges.size.should.equal(1);
      graph.removeEdge(edge);
      graph.nodes.size.should.equal(2);
      graph.edges.size.should.equal(0);
    });
  }); // #removeEdge(edge)

  describe('#hasEdge(start, dest)', () => {

    it('should throw error if nodes are not in graph', () => {
      let graph = new Graph();
      let start = new Node(0, 0);
      let dest = new Node(100, 0);
      graph.addNode(start);
      (function() {
        graph.hasEdge(start, dest);
      }).should.throw(Error);
    });

    it('should return true if has edge', () => {
      let graph = new Graph();
      let start = new Node(0, 0);
      let dest = new Node(100, 0)
      let edge = new Edge(start, dest);
      graph.addNode(start);
      graph.addNode(dest);
      graph.addEdge(edge);
      graph.hasEdge(start, dest).should.be.true;
    });

    it('should not add duplicate edge', () => {
      let graph = new Graph();
      let start = new Node(0, 0);
      let dest = new Node(100, 0)
      let edge = new Edge(start, dest);
      graph.addNode(start);
      graph.addNode(dest);
      graph.addEdge(edge);
      graph.hasEdge(start, start).should.be.false;
    });

  }); // #hasEdge(start, dest)

  describe('#forEachNode(callback)', () => {

    it('should run callback(node) for each node', () => {
      let graph = new Graph();
      let nodeVisited = new Map();

      for (let i = 0; i < 10; i++) {
        let node = new Node(Math.random(), Math.random());
        graph.addNode(node);
        nodeVisited.set(node, false);
      }

      graph.forEachNode((node) => {
        nodeVisited.set(node, true);
      });

      for (let [key, value] of nodeVisited) {
        value.should.be.true;
      }
    });

    it('should break if callback(node) returns false', () => {
      let graph = new Graph();
      let nodeVisited = new Map();

      for (let i = 0; i < 10; i++) {
        let node = new Node(Math.random(), Math.random());
        graph.addNode(node);
        nodeVisited.set(node, false);
      }

      let firstNode;
      graph.forEachNode((node) => {
        nodeVisited.set(node, true);
        firstNode = node;
        return false;
      });

      for (let [key, value] of nodeVisited) {
        if (key === firstNode) {
          value.should.be.true;
        } else {
          value.should.be.false;
        }
      }
    });

  }); // #forEachNode(callback)

}); // Graph
