import { MouseHandler } from '../util/mouse-handler';
import * as Toolbar from '../ui/toolbar';
import * as UI from '../ui/ui';
import { initCurved } from '../util/curvedEdge';

let canvas;
let context;
let mouseHandler;

const SCALE_MODIFIER = 0.9;
// scale of 0.5 means drawing at half size (0.5 pixels for each original pixel)
let scale = 1;
let dx = 0;
let dy = 0;

export function init(graph) {
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');

  initCurved(canvas, context);

  initMouseHandler(graph);
}

export function resize(event) {
  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;
}

export function getDx() {
  return dx;
}

export function getDy() {
  return dy;
}

export function setPosition(newDx, newDy) {
  dx = newDx;
  dy = newDy;

  UI.updateCanvasPosition(dx, dy);
}

export function getScale() {
  return scale;
}

export function setScale(newScale) {
  scale = newScale;
  UI.updateZoom(scale);
}

export function reset() {
  setPosition(0, 0);
  setScale(1);
  update();
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

export function getContext() {
  return context;
}

export function clear() {
  context.clearRect(dx, dy, canvas.width / scale, canvas.height / scale);
}

export function update() {
  // reset the transformations done to the canvas
  context.resetTransform();

  // context.setTransform(xScale, xSkew, ySkew, yScale, dx, dy) applies
  // the translation before the scale.
  // This is not what we want, since the scale is done relative to (0,0)
  // and the position displayed at the top-left corner will no longer
  // be (dx,dy), which means the coordinates under the mouse will change.

  // scale both x- and y-axis
  context.scale(scale, scale);

  // context.translate(a, b) translates the canvas origin by (a,b).
  // Since (dx,dy) are the coordinates calculated for the new origin, the
  // canvas needs to be translated by (-dx,-dy).
  context.translate(-dx, -dy);
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

    // store the current scale value
    let oldScale = scale;

    // get the amount the mousewheel was scrolled
    let delta = event.deltaY;
    if (delta > 0) {
      // scroll down
      scale = Math.max(scale * SCALE_MODIFIER, 0.1);
    } else if (delta < 0) {
      // scroll up
      scale = Math.min(scale / SCALE_MODIFIER, 10);
    }

    // get the mouse position (relative to the canvas element)
    let mouseX = event.offsetX;
    let mouseY = event.offsetY;

    // Calculate the new position of the displayed origin (top left corner).
    // (dx,dy) are the coordinates of the top-left corner.
    // (x1,y1) and (x2,y2) are the coordinates at the mouse position before
    // and after changing the scale, respectively.
    //
    // With the old scale value:
    //     dx1 = dx
    //     dy1 = dy
    //     x1 = dx + mouseX / oldScale
    //     y1 = dy + mouseY / oldScale
    //
    // With new scale:
    //     dx2 = dx + mouseX / oldScale - mouseX / scale
    //     dy2 = dy + mouseY / oldScale - mouseY / scale
    //     x2 = dx2 + mouseX / scale
    //        = dx + mouseX / oldScale - mouseX / scale + mouseX / scale
    //        = dx + mouseX / oldScale
    //        = x1
    //     y2 = dy2 + mouseY / scale
    //        = dy + mouseY / oldScale - mouseY / scale + mouseY / scale
    //        = dy + mouseY / oldScale
    //        = y1
    //
    // Note that (x1,y1) = (x2,y2) which means the coordinates under
    // the mouse stays the same.
    dx += mouseX / oldScale - mouseX / scale;
    dy += mouseY / oldScale - mouseY / scale;

    update();

    UI.updateZoom(scale);
    UI.updateCanvasPosition(dx, dy);
  }, false);
}
