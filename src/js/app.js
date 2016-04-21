require('../scss/styles.scss');

import { Graph } from './data/graph';
import { Serializer } from 'util/graph-serialize';
import ui from './ui/ui';

let graph;
let serializer;

function init() {
  graph = new Graph();
  serializer = new Serializer(graph, resetGraph);
  ui.init(graph);
  ui.toolbar.selectToolByName('node');
  ui.canvas.resize();
  window.requestAnimationFrame(draw);
}

function draw() {
  ui.canvas.clear();
  graph.draw(ui.canvas.context);
  window.requestAnimationFrame(draw);
}

function resetGraph(newGraph) {
  graph = newGraph;
  Canvas.resetGraph(newGraph);
  UI.resetGraph(newGraph);
  serializer.resetGraph(newGraph);
}

window.addEventListener('load', init, false);

window.addEventListener('resize', (event) => {
  if (ui.canvas) {
    ui.canvas.resize();
  }
}, false);
