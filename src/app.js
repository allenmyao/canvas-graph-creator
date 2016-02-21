import 'babel-polyfill';

import { Graph } from './graph';
import { Node } from './node';
import { Edge } from './edge';
import { MouseHandler } from './mouse-handler';
import { NodeTool } from './node-tool';
import { EdgeTool } from './edge-tool';
import { MoveTool } from './move-tool';

var canvas;
var context;
var graph;
var mouseHandler;
var currentTool = new NodeTool();
var toolbar;
var toolMap = {
    node: new NodeTool(),
    edge: new EdgeTool(),
    move: new MoveTool()
};

function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    graph = new Graph();

    initMouseHandler();
    initToolbar();

    window.requestAnimationFrame(draw);
}

function initMouseHandler() {
    mouseHandler = new MouseHandler(graph);

    canvas.addEventListener('mousedown', (event) => {
        let canvasLeft = canvas.offsetLeft;
        let canvasTop = canvas.offsetTop;

        let x = event.pageX - canvasLeft;
        let y = event.pageY - canvasTop;

        mouseHandler.downListener(event, currentTool, x, y);
    }, false);

    canvas.addEventListener('mouseup', (event) => {
        let canvasLeft = canvas.offsetLeft;
        let canvasTop = canvas.offsetTop;

        let x = event.pageX - canvasLeft;
        let y = event.pageY - canvasTop;

        mouseHandler.upListener(event, currentTool, x, y);
    }, false);

    canvas.addEventListener('mousemove', (event) => {
        let canvasLeft = canvas.offsetLeft;
        let canvasTop = canvas.offsetTop;

        let x = event.pageX - canvasLeft;
        let y = event.pageY - canvasTop;

        mouseHandler.moveListener(event, currentTool, x, y);
    }, false);
}

function initToolbar() {
    toolbar = document.getElementById('toolbar');

    let tools = document.getElementsByClassName('tool');
    for (let i = 0; i < tools.length; i++) {
        tools[i].addEventListener('click', (event) => {
            let toolName = event.target.getAttribute('data-tool');
            currentTool = toolMap[toolName];

            let tools = document.getElementsByClassName('tool');
            for (let i = 0; i < tools.length; i++) {
                if (tools[i] === event.target) {
                    tools[i].classList.add('selected');
                } else {
                    tools[i].classList.remove('selected');
                }
            }
        });
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    graph.draw(context);
    window.requestAnimationFrame(draw);
}

window.addEventListener('load', init, false);
