import MouseHandler from '../util/mouse-handler';
import ContextMenu from '../ui/context-menu';

const SCALE_MODIFIER = 0.9;

/**
 * Front end canvas frame which reacts to mouse-clicks upon it. 
 * @class Canvas
 */
class Canvas {

  /**
   * An instance of the UI 
   * @type {UI}
   */
  ui;

  /**
   * An instance of the canvas element on the browser
   * @type {HTMLCanvasElement}
   */
  canvas;
  
  /**
   * An instance of a rendering context
   * @type {CanvasRenderingContext2D}
   */
  context;

  /**
   * A number value which remembers the zoom factor
   * @type {Number}
   */
  scaleValue = 1;
  
  /**
   * A number value which remembers the centered horizontal position on the graph
   * @type {Number}
   */
  dx = 0;
  
  /**
   * A number value which remembers the centered vertical position on the graph
   * @type {Number}
   */
  dy = 0;

  /**
   * An instance of the mouseHandler which interfaces the canvas with the graph
   * @type {MouseHandler}
   */
  mouseHandler;
  
  /**
   * An instance of the contextMenu
   * @type {ContextMenu}
   */
  contextMenu;

  /**
   * Constructor for the Canvas object
   * @param {UI} ui - refers to the master ui object
   */
  constructor(ui) {
    this.ui = ui;
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');
  }

  /**
   * Initializes the mouse handler, context menu, and other listeners
   * @param {Graph} graph - refers to the master graph object
   */
  init(graph) {
    this.mouseHandler = new MouseHandler(graph);
    this.contextMenu = new ContextMenu(this.ui, this.mouseHandler);
    this.initListeners();
  }

  resetGraph(newGraph) {
    this.mouseHandler.resetGraph(newGraph);
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

  /**
   * Functions gets the x-position of the click event on the full canvas
   * @param {HTMLEvent} event - the click event which triggered this call
   * @return {Number} x - The x-position of the click event on the full canvas
   */
  getCanvasX(event) {
    let canvasX;
    if (event.target === this.canvas) {
      canvasX = event.offsetX;
    } else {
      canvasX = event.pageX - this.canvas.offsetLeft;
    }
    let x = canvasX / this.scale + this.dx;
    return x;
  }

  /**
   * Functions gets the y-position of the click event on the full canvas
   * @param {HTMLEvent} event - the click event which triggered this call
   * @return {Number} y - The y-position of the click event on the full canvas
   */
  getCanvasY(event) {
    let canvasY;
    if (event.target === this.canvas) {
      canvasY = event.offsetY;
    } else {
      canvasY = event.pageY - this.canvas.offsetTop;
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

  /**
   * Creates all the listeners for every event which happens upon the canvas. 
   * Based on the event it calls the relevant function. 
   */  
  initListeners() {
    this.canvas.addEventListener('mousedown', (event) => {
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
      event.stopPropagation();
      let x = this.getCanvasX(event);
      let y = this.getCanvasY(event);

      if (event.button === 0 && event.buttons !== 2) {
        this.mouseHandler.moveListener(event, this.ui.toolbar.currentTool, x, y);
      } else if (event.button === 2 || event.buttons === 2) {
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

    document.addEventListener('selectstart', (event) => {
      event.stopPropagation();
      event.preventDefault();
      return false;
    });

    document.addEventListener('dblclick', (event) => {
      event.stopPropagation();
      event.preventDefault();
      return false;
    });
  }
}

export { Canvas };
export default Canvas;
