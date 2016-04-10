require('../scss/styles.scss');

import { Graph } from 'data/graph';
import * as Canvas from 'ui/canvas';
import * as UI from 'ui/ui';

let graph;

function init() {
  graph = new Graph();
  Canvas.init(graph);
  Canvas.resize();
  UI.init(graph);
  window.requestAnimationFrame(draw);
}

function draw() {
  Canvas.clear();
  graph.draw(Canvas.getContext());
  window.requestAnimationFrame(draw);
}

window.addEventListener('load', init, false);

window.addEventListener('resize', Canvas.resize, false);
