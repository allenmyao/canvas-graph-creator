import { Graph } from 'graph';
import * as Canvas from 'ui/canvas';
import * as UI from 'ui/ui';
import { initCurved } from './curvedEdge';

let graph;

function init() {
    graph = new Graph();
    Canvas.init(graph);
    initCurved(Canvas.getContext().canvas, Canvas.getContext());
    UI.init();
    window.requestAnimationFrame(draw);
}

function draw() {
    Canvas.clear();
    graph.draw(Canvas.getContext());
    window.requestAnimationFrame(draw);
}

window.addEventListener('load', init, false);
