/* eslint no-unused-expressions: 0 */

import chai from 'chai';
let should = chai.should();

import { EraseTool } from '../../src/js/tool/erase-tool';
import { Graph } from '../../src/js/data/graph';
import { CircleNode } from '../../src/js/data/node/circle-node';
import { SolidEdge } from '../../src/js/data/edge/solid-edge';

describe('EraseTool', () => {
  let eraseTool;

  beforeEach(() => {
    eraseTool = new EraseTool();
  });

  describe('#constructor', () => {
    it('should create instance of EraseTool', () => {
      eraseTool.should.be.instanceOf(EraseTool);
    });
  });

  describe('#preSelectObject', () => {
    it('should return true', () => {
      (eraseTool.preSelectObject()).should.be.true;
    });
  });

  describe('#preDragObject', () => {
    it('should return false', () => {
      (eraseTool.preDragObject()).should.be.false;
    });
  });

  describe('#selectObject', () => {
    let graph;
    let node1;
    let node2;
    let edge;

    beforeEach(() => {
      graph = new Graph();
      node1 = new CircleNode(0, 0);
      node2 = new CircleNode(100, 100);
      graph.addNode(node1);
      graph.addNode(node2);
      edge = new SolidEdge(node1, node2);
      graph.addEdge(edge);
    });

    it('should remove nodes', () => {
      eraseTool.selectObject(null, graph, node1, 0, 0);
      (graph.nodes.has(node1)).should.be.false;
    });

    it('should remove nodes and the edges connected to that node', () => {
      eraseTool.selectObject(null, graph, node1, 0, 0);
      (graph.nodes.has(edge)).should.be.false;
    });

    it('should remove edges', () => {
      eraseTool.selectObject(null, graph, edge, 0, 0);
      (graph.edges.has(edge)).should.be.false;
    });

    it('should not handle other types of objects', () => {
      eraseTool.selectObject(null, graph, null, 0, 0);
      (graph.nodes.has(node1)).should.be.true;
      (graph.nodes.has(node2)).should.be.true;
      (graph.edges.has(edge)).should.be.true;
    });
  });

  describe('#dragOverObject', () => {
    let graph;
    let node1;
    let node2;
    let edge;

    beforeEach(() => {
      graph = new Graph();
      node1 = new CircleNode(0, 0);
      node2 = new CircleNode(100, 100);
      graph.addNode(node1);
      graph.addNode(node2);
      edge = new SolidEdge(node1, node2);
      graph.addEdge(edge);
    });

    it('should remove nodes', () => {
      eraseTool.dragOverObject(null, graph, node1, 0, 0);
      (graph.nodes.has(node1)).should.be.false;
    });

    it('should remove nodes and the edges connected to that node', () => {
      eraseTool.dragOverObject(null, graph, node1, 0, 0);
      (graph.nodes.has(edge)).should.be.false;
    });

    it('should remove edges', () => {
      eraseTool.dragOverObject(null, graph, edge, 0, 0);
      (graph.edges.has(edge)).should.be.false;
    });

    it('should not handle other types of objects', () => {
      eraseTool.dragOverObject(null, graph, null, 0, 0);
      (graph.nodes.has(node1)).should.be.true;
      (graph.nodes.has(node2)).should.be.true;
      (graph.edges.has(edge)).should.be.true;
    });
  });
});
