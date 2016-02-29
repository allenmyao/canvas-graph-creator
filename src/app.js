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

const SCALE_MODIFIER = 0.9;

// scale of 0.5 means drawing at half size
let scale = 1;
let dx = 0;
let dy = 0;

function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    graph = new Graph();

    initMouseHandler();
    initToolbar();
    showModes();

    window.requestAnimationFrame(draw);
}

function getCanvasX(event) {
        let canvasX = event.offsetX;
        let x = canvasX / scale + dx;
        return x;
}

function getCanvasY(event) {
        let canvasY = event.offsetY;
        let y = canvasY / scale + dy;
        return y;
}

function initMouseHandler() {
    mouseHandler = new MouseHandler(graph);

    canvas.addEventListener('mousedown', (event) => {
        let x = getCanvasX(event);
        let y = getCanvasY(event);

        mouseHandler.downListener(event, currentTool, x, y);
    }, false);

    canvas.addEventListener('mouseup', (event) => {
        let x = getCanvasX(event);
        let y = getCanvasY(event);

        mouseHandler.upListener(event, currentTool, x, y);
    }, false);

    canvas.addEventListener('mousemove', (event) => {
        let x = getCanvasX(event);
        let y = getCanvasY(event);

        mouseHandler.moveListener(event, currentTool, x, y);
    }, false);

    canvas.addEventListener('wheel', (event) => {
        // console.log(`mouse: (${event.offsetX}, ${event.offsetY})`);
        // console.log(`origin: (${dx}, ${dy})`);
        // prevent page scrolling (the default scroll behavior)
        event.preventDefault();

        let oldScale = scale;

        let delta = event.deltaY;
        if (delta > 0) {
            // scroll down
            scale = Math.max(scale * SCALE_MODIFIER, 0.1);
        } else if (delta < 0) {
            // scroll up
            scale = Math.min(scale / SCALE_MODIFIER, 10);
        }

        let mouseX = event.offsetX;
        let mouseY = event.offsetY;
        dx += mouseX / oldScale - mouseX / scale;
        dy += mouseY / oldScale - mouseY / scale;

        context.resetTransform();
        // context.setTransform(); does the translate first then scale
        context.scale(scale, scale);
        context.translate(-dx, -dy);
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

            selectItem('tool');

            showModes();
        });
    }

    // add event listener for mode clicks
    document.getElementById('tool-modes').addEventListener('click', (event) => {
        if (event.target.classList.contains('mode')) {
            console.log(`changing to ${event.target.getAttribute('data-mode')}`);
            currentTool.currentMode = event.target.getAttribute('data-mode');
            selectItem('mode');
        }
    });
}

function selectItem(className) {
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
    context.clearRect(dx, dy, canvas.width / scale, canvas.height / scale);
    graph.draw(context);
    window.requestAnimationFrame(draw);
}

window.addEventListener('load', init, false);
