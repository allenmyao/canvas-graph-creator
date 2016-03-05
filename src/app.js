import { Graph } from './graph';
import { Node } from './node';
import { Edge } from './edge';
import { MouseHandler } from './mouse-handler';
import { NodeTool } from './node-tool';
import { EdgeTool } from './edge-tool';
import { MoveTool } from './move-tool';
import { EraseTool } from './erase-tool';
import { initCurved } from './curvedEdge';

export var canvas;
export var context;
var graph;
var mouseHandler;
var currentTool = new NodeTool();
var toolbar;
var toolMap = {
    node: new NodeTool(),
    edge: new EdgeTool(),
    move: new MoveTool(),
    erase: new EraseTool()
};

function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    initCurved(canvas, context);

    graph = new Graph();

    initMouseHandler();
    initToolbar();
    showModes();

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
            // currentTool.cancel();

            let toolName = event.target.getAttribute('data-tool');
            currentTool = toolMap[toolName];

            selectItem('tool', event);

            showModes();
        });
    }

    // add event listener for mode clicks
    document.getElementById('tool-modes').addEventListener('click', (event) => {
        if (event.target.classList.contains('mode')) {
            console.log(`changing to ${event.target.getAttribute('data-mode')}`);
            currentTool.currentMode = event.target.getAttribute('data-mode');
            selectItem('mode', event);
        }
    });
}

function selectItem(className, event) {
    let elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
        if (elements[i] === event.target) {
            elements[i].classList.add('selected');
        } else {
            elements[i].classList.remove('selected');
        }
    }
}

function showModes() {
    let modeList = document.getElementById('tool-modes');
    if (currentTool.hasModes()) {
        // populate modes list
        let html = '';
        for (let mode of Object.keys(currentTool.constructor.modes)) {
            let selected = mode === currentTool.currentMode ? ' selected' : '';;
            html += `<li class="tool-mode"><div class="mode vcenter-wrapper${selected}" data-mode="${mode}"><span class="vcenter">${mode}</span></div></li>`;
        }

        modeList.innerHTML = `<ul class="tool-mode-list">${html}</ul>`;
    } else {
        // clear the modes
        modeList.innerHTML = '';
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    graph.draw(context);
    window.requestAnimationFrame(draw);
}

window.addEventListener('load', init, false);
