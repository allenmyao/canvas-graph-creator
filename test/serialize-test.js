// graph serialize unit tests
/* eslint no-unused-expressions: 0 */

import chai from 'chai';
chai.should();

import { Serializer } from '../src/js/util/graph-serialize';
import { Graph } from '../src/js/data/graph';
import { CircleNode as Node } from '../src/js/data/node/circle-node';
import { HexagonNode } from '../src/js/data/node/hexagon-node';
import { SolidEdge as Edge } from '../src/js/data/edge/solid-edge';

describe('Serializer', () => {
  describe('#constructor', () => {
    it('creates instance of Serializer', () => {
      let graph = new Graph();
      let fn = function (g) {};
      (new Serializer(graph, fn)).should.be.instanceof(Serializer);
    });
  });

  describe('#emptyGraph', () => {
    it('should create valid graph obj export', () => {
      let graph = new Graph();
      let fn = function (g) {};
      let serializer = new Serializer(graph, fn);
      let serialObj = serializer.serializeGraph();
      console.log(JSON.stringify(serialObj));
      (serialObj.hasOwnProperty('_$$SET$$_edges')).should.be.true;
      (serialObj.hasOwnProperty('_$$SET$$_nodes')).should.be.true;
      (serialObj._$$SET$$_nodes.length).should.equal(0);
      (serialObj._$$SET$$_edges.length).should.equal(0);
    });

    it('should create valid graph obj import', () => {
      let graph = new Graph();
      let fn = function (g) {};
      let serializer = new Serializer(graph, fn);
      let serialObj = serializer.serializeGraph();
      let deserializeInfo = serializer.deserializeGraph(serialObj);
      let graph2 = deserializeInfo.graph;
      (graph2).should.be.instanceof(Graph);
      graph2.nodes.size.should.equal(0);
      graph2.edges.size.should.equal(0);
      (graph2 === graph).should.be.false;
    });
  });

  describe('#populatedGraph', () => {
    it('should create valid graph obj export', () => {
      let node1 = new Node(0, 0);
      let node2 = new Node(1, 0);
      let edge1 = new Edge(node1, node2);

      let nodes = new Set();
      nodes.add(node1);
      nodes.add(node2);

      let edges = new Set();
      edges.add(edge1);

      let graph = new Graph(nodes, edges);
      let fn = function (g) {};
      let serializer = new Serializer(graph, fn);
      let serialObj = serializer.serializeGraph();
      (serialObj.hasOwnProperty('_$$SET$$_edges')).should.be.true;
      (serialObj.hasOwnProperty('_$$SET$$_nodes')).should.be.true;
      let edgeArray = serialObj._$$SET$$_edges;
      let nodeArray = serialObj._$$SET$$_nodes;
      (nodeArray.length).should.equal(2);
      (edgeArray.length).should.equal(1);
    });

    it('should create valid graph obj import', () => {
      let node1 = new Node(0, 0);
      let node2 = new Node(1, 0);
      let edge1 = new Edge(node1, node2);

      let nodes = new Set();
      nodes.add(node1);
      nodes.add(node2);

      let edges = new Set();
      edges.add(edge1);

      let graph = new Graph(nodes, edges);
      let fn = function (g) {};
      let serializer = new Serializer(graph, fn);
      let serialObj = serializer.serializeGraph();
      let edgeArray = serialObj._$$SET$$_edges;
      let nodeArray = serialObj._$$SET$$_nodes;
      (nodeArray.length).should.equal(2);
      (edgeArray.length).should.equal(1);
      let deserializeInfo = serializer.deserializeGraph(serialObj);
      let graph2 = deserializeInfo.graph;
      (graph2).should.be.instanceof(Graph);
      (graph2.edges.size).should.equal(1);
      (graph2.nodes.size).should.equal(2);
      for (let testNode of graph2.nodes) {
        (testNode.id === node1.id || testNode.id === node2.id).should.be.true;
      }
      for (let testEdge of graph2.edges) {
        (testEdge.id === edge1.id).should.be.true;
      }
    });
    it('should create valid graph obj import', () => {
      let node1 = new Node(0, 0);
      let node2 = new Node(1, 0);
      let node3 = new HexagonNode(2, 0);
      let node4 = new Node(3, 0);
      let edge1 = new Edge(node1, node2);
      let edge2 = new Edge(node1, node3);

      let nodes = new Set();
      nodes.add(node1);
      nodes.add(node2);
      nodes.add(node3);
      nodes.add(node4);

      let edges = new Set();
      edges.add(edge1);
      edges.add(edge2);

      let graph = new Graph(nodes, edges);
      let fn = function (g) {};
      let serializer = new Serializer(graph, fn);
      let serialObj = serializer.serializeGraph();
      let edgeArray = serialObj._$$SET$$_edges;
      let nodeArray = serialObj._$$SET$$_nodes;
      (nodeArray.length).should.equal(4);
      (edgeArray.length).should.equal(2);
      let deserializeInfo = serializer.deserializeGraph(serialObj);
      let graph2 = deserializeInfo.graph;
      (graph2).should.be.instanceof(Graph);
      (graph2.edges.size).should.equal(2);
      (graph2.nodes.size).should.equal(4);
      for (let testNode of graph2.nodes) {
        switch (testNode.id) {
        case node1.id:
          (testNode).should.be.instanceof(Node);
          for(let testEdge of testNode.edges) {
            (testEdge.id === edge1.id || testEdge.id === edge2.id).should.be.true;
          }
          break;
        case node2.id:
          (testNode).should.be.instanceof(Node);
          for(let testEdge of testNode.edges) {
            (testEdge.id === edge1.id).should.be.true;
          }
          break;
        case node3.id:
          (testNode).should.be.instanceof(HexagonNode);
          for(let testEdge of testNode.edges) {
            (testEdge.id === edge2.id).should.be.true;
          }
          break;
        case node4.id:
          (testNode).should.be.instanceof(Node);
          testNode.edges.size.should.equal(0);
          break;
        default:
          // should never be reached
          (0).should.equal(1);
        }
      }
      for (let testEdge of graph2.edges) {
        switch (testEdge.id) {
        case edge1.id:
          (testEdge).should.be.instanceof(Edge);
          (testEdge.startNode.id).should.equal(node1.id);
          (testEdge.destNode.id).should.equal(node2.id);
          break;
        case edge2.id:
          (testEdge).should.be.instanceof(Edge);
          (testEdge.startNode.id).should.equal(node1.id);
          (testEdge.destNode.id).should.equal(node3.id);
          break;
        default:
          // should never be reached
          (0).should.equal(1);
        }
      }
    });
  });
});
