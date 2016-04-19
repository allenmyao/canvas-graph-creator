require('../scss/styles.scss');

import { Graph } from './data/graph';
import ui from './ui/ui';

let graph;

function init() {
  graph = new Graph();
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

window.addEventListener('load', init, false);

window.addEventListener('resize', (event) => {
  if (ui.canvas) {
    ui.canvas.resize();
  }
}, false);
