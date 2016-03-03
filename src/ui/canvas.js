import { MouseHandler } from 'mouse-handler';
import * as Toolbar from 'ui/toolbar';
import * as UI from 'ui/ui';

let canvas;
let context;
let mouseHandler;

const SCALE_MODIFIER = 0.9;
// scale of 0.5 means drawing at half size
let scale = 1;
let dx = 0;
let dy = 0;

function init(graph) {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    initMouseHandler(graph);
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

function getContext() {
    return context;
}

function clear() {
    context.clearRect(dx, dy, canvas.width / scale, canvas.height / scale);
}

function initMouseHandler(graph) {
    mouseHandler = new MouseHandler(graph);

    canvas.addEventListener('mousedown', (event) => {
        let x = getCanvasX(event);
        let y = getCanvasY(event);

        mouseHandler.downListener(event, Toolbar.getCurrentTool(), x, y);
    }, false);

    canvas.addEventListener('mouseup', (event) => {
        let x = getCanvasX(event);
        let y = getCanvasY(event);

        mouseHandler.upListener(event, Toolbar.getCurrentTool(), x, y);
    }, false);

    canvas.addEventListener('mousemove', (event) => {
        let x = getCanvasX(event);
        let y = getCanvasY(event);

        mouseHandler.moveListener(event, Toolbar.getCurrentTool(), x, y);
    }, false);

    canvas.addEventListener('wheel', (event) => {
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

        UI.updateZoom(scale);
        UI.updateCanvasPosition(dx, dy);
    }, false);
}

export { init, getContext, clear };
