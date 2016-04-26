import MouseHandler from '../util/mouse-handler';
import ContextMenu from '../ui/context-menu';

const SCALE_MODIFIER = 0.9;

class Canvas {

  ui;

  canvas;
  context;

  // scale of 0.5 means drawing at half size (0.5 pixels for each original pixel)
  scaleValue = 1;
  dx = 0;
  dy = 0;

  mouseHandler;
  contextMenu;

  constructor(ui) {
    this.ui = ui;
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');
  }

  init(graph) {
    this.mouseHandler = new MouseHandler(graph);
    this.contextMenu = new ContextMenu(this.ui, this.mouseHandler);
    this.initListeners();
  }

  resize(event) {
    this.context.canvas.width = window.innerWidth;
    this.context.canvas.height = window.innerHeight;
    this.update();
  }

  get scale() {
    return this.scaleValue;
  }

  set scale(scale) {
    this.scaleValue = scale;
    this.ui.statusBar.updateZoom(scale);
  }

  reset() {
    this.dx = 0;
    this.dy = 0;
    this.scale = 1;
    this.update();
    this.ui.statusBar.updateMouse(0, 0);
  }

  clear() {
    this.context.clearRect(this.dx, this.dy, this.canvas.width / this.scale, this.canvas.height / this.scale);
  }

  getCanvasX(event) {
    let canvasX;
    if (event.target === this.canvas) {
      canvasX = event.offsetX;
    } else {
      let offsets = document.getElementById('canvas').getBoundingClientRect();
      canvasX = event.screenX - offsets.left;
    }
    let x = canvasX / this.scale + this.dx;
    return x;
  }

  getCanvasY(event) {
    let canvasY;
    if (event.target === this.canvas) {
      canvasY = event.offsetY;
    } else {
      let offsets = document.getElementById('canvas').getBoundingClientRect();
      canvasY = event.screenY - offsets.top;
    }
    let y = canvasY / this.scale + this.dy;
    return y;
  }

  update() {
    // reset the transformations done to the canvas
    this.context.resetTransform();

    // context.setTransform(xScale, xSkew, ySkew, yScale, dx, dy) applies
    // the translation before the scale.
    // This is not what we want, since the scale is done relative to (0,0)
    // and the position displayed at the top-left corner will no longer
    // be (dx,dy), which means the coordinates under the mouse will change.

    // scale both x- and y-axis
    this.context.scale(this.scale, this.scale);

    // context.translate(a, b) translates the canvas origin by (a,b).
    // Since (dx,dy) are the coordinates calculated for the new origin, the
    // canvas needs to be translated by (-dx,-dy).
    this.context.translate(-1 * this.dx, -1 * this.dy);
  }

  initListeners() {
    this.canvas.addEventListener('mousedown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      let x = this.getCanvasX(event);
      let y = this.getCanvasY(event);

      if (event.button === 0 && !this.contextMenu.isDisplayed) {
        this.mouseHandler.downListener(event, this.ui.toolbar.currentTool, x, y);
      } else if (event.button === 2) {
        this.mouseHandler.rightDownListener(event, x, y);
      }

      if (this.contextMenu.isDisplayed) {
        this.contextMenu.toggleContextMenu();
      }
    });

    window.addEventListener('mouseup', (event) => {
      event.preventDefault();
      event.stopPropagation();
      let x = this.getCanvasX(event);
      let y = this.getCanvasY(event);

      if (event.button === 0) {
        this.mouseHandler.upListener(event, this.ui.toolbar.currentTool, x, y);
      } else if (event.button === 2) {
        this.mouseHandler.rightUpListener(event, x, y);
      }
    });

    window.addEventListener('mousemove', (event) => {
      event.preventDefault();
      event.stopPropagation();
      let x = this.getCanvasX(event);
      let y = this.getCanvasY(event);

      if (event.button === 0) {
        this.mouseHandler.moveListener(event, this.ui.toolbar.currentTool, x, y);
      } else if (event.button === 2) {
        this.mouseHandler.rightMoveListener(event, x, y);
      }
    });

    window.addEventListener('contextmenu', (event) => {
      if (event.target === this.canvas) {
        // prevent default context menu
        event.preventDefault();
      }
      event.stopPropagation();
      let x = this.getCanvasX(event);
      let y = this.getCanvasY(event);

      this.mouseHandler.contextmenuEventListener(event, x, y, this.contextMenu);
    });

    this.canvas.addEventListener('wheel', (event) => {
      event.stopPropagation();
      // prevent page scrolling (the default scroll behavior)
      event.preventDefault();

      // store the current scale value
      let oldScale = this.scale;

      // get the amount the mousewheel was scrolled
      let delta = event.deltaY;
      if (delta > 0) {
        // scroll down
        this.scale = Math.max(this.scale * SCALE_MODIFIER, 0.1);
      } else if (delta < 0) {
        // scroll up
        this.scale = Math.min(this.scale / SCALE_MODIFIER, 10);
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
      this.dx += mouseX / oldScale - mouseX / this.scale;
      this.dy += mouseY / oldScale - mouseY / this.scale;

      this.update();

      this.ui.statusBar.updateZoom(this.scale);
    });

    this.canvas.addEventListener('selectstart', (event) => {
      event.stopPropagation();
      event.preventDefault();
      return false;
    });

    this.canvas.addEventListener('dblclick', (event) => {
      event.stopPropagation();
      event.preventDefault();
      return false;
    });
  }
}

export { Canvas };
export default Canvas;
