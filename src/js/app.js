require('../scss/styles.scss');

import { Graph } from 'data/graph';
import { Serializer } from 'util/graph-serialize';
import * as Canvas from 'ui/canvas';
import * as UI from 'ui/ui';

let graph;
let serializer;

function init() {
  graph = new Graph();
  serializer = new Serializer(graph, resetGraph);
  Canvas.init(graph);
  UI.init(graph);
  window.requestAnimationFrame(draw);
}

function draw() {
  Canvas.clear();
  graph.draw(Canvas.getContext());
  window.requestAnimationFrame(draw);
}

function resetGraph(newGraph) {
  graph = newGraph;
  Canvas.resetGraph(newGraph);
  UI.resetGraph(newGraph);
}

window.addEventListener('load', init, false);
