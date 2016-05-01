import Node from '../data/node/node';
import Edge from '../data/edge/edge';
import Label from '../data/label';
import ui from '../ui/ui';

import PanTool from '../tool/pan-tool';

class MouseHandler {

  // distance the mouse needs to move to start a drag
  // this prevents accidentally dragging a few pixels when actually trying to click
  DRAG_THRESHOLD = 7;

  selectedObject = null;
  draggedObject = null;

  clickStartX = null;
  clickStartY = null;
  mousePressed = false;
  isDragging = false;

  rightClickStartX = null;
  rightClickStartY = null;
  rightMousePressed = false;
  isRightDragging = false;
  wasRightDragging = false;

  panTool = new PanTool();

  constructor(graph) {
    this.graph = graph;
  }

  resetGraph(newGraph) {
    this.graph = newGraph;
    this.selectedObject = null;
    this.draggedObject = null;

    this.clickStartX = null;
    this.clickStartY = null;
    this.mousePressed = false;
    this.isDragging = false;
  }

  downListener(event, currentTool, x, y) {
    this.mousePressed = true;
    this.clickStartX = x;
    this.clickStartY = y;

    if (this.graph.hasComponent(x, y)) {
      let component = this.graph.getComponent(x, y);
      if (currentTool.preSelectObject(event, this.graph, component, x, y)) {
        // console.log('Preselect Object Ok!');
        this.selectedObject = component;
      } else {
        // console.log('Preselect Object Denied!');
        this.selectedObject = null;
      }
    } else {
      // console.log('Preselect None!');
      currentTool.preSelectNone(event, this.graph, x, y);
      this.selectedObject = null;
    }
  }

  upListener(event, currentTool, x, y) {
    // check if dragging
    if (this.isDragging) {
      this.isDragging = false;

      // drop object
      if (this.graph.hasComponent(x, y, this.draggedObject)) {
        currentTool.dropOnObject(event, this.graph, this.draggedObject, this.graph.getComponent(x, y), x, y);
      } else {
        currentTool.dropOnNone(event, this.graph, this.draggedObject, x, y);
      }
      this.draggedObject = null;
    } else if (this.mousePressed) {
      // click
      let component = null;
      if (this.graph.hasComponent(x, y)) {
        component = this.graph.getComponent(x, y);
      }
      if (component === this.selectedObject) {
        if (component) {
          currentTool.selectObject(event, this.graph, component, x, y);
          ui.sidebar.updateSidebar(component);
        } else {
          currentTool.selectNone(event, this.graph, x, y);
          ui.sidebar.updateSidebar();
        }
      } else {
        currentTool.abortSelect(this.graph, x, y);
      }
    }
    this.mousePressed = false;
    this.selectedObject = null;
  }

  moveListener(event, currentTool, x, y) {
    ui.statusBar.updateMouse(x, y);

    if (!this.isDragging) {
      // check for dragging
      if (this.mousePressed) {
        // check if mouse movement passes threshold
        let dx = x - this.clickStartX;
        let dy = y - this.clickStartY;

        if (Math.sqrt(dx * dx + dy * dy) >= this.DRAG_THRESHOLD) {
          // console.log('Drag Threshold!');
          this.isDragging = true;
          if (this.selectedObject !== null) {
            if (currentTool.preDragObject(event, this.graph, this.selectedObject, x, y)) {
              this.draggedObject = this.selectedObject;
            } else {
              this.selectedObject = null;
              this.draggedObject = null;
            }
          } else {
            currentTool.preDragNone(event, this.graph, x, y);
            this.draggedObject = this.selectedObject;
          }
        }
      } else {
        // regular move
        // hover effect?
      }
    } else if (this.draggedObject) {
      // handle dragging object
      currentTool.dragObject(event, this.graph, this.draggedObject, x, y);
      ui.sidebar.updateSidebar(this.draggedObject);
    } else if (this.graph.hasComponent(x, y)) {
      // handle dragging over object
      currentTool.dragOverObject(event, this.graph, this.graph.getComponent(x, y), x, y);
      ui.sidebar.updateSidebar();
    } else {
      // handle dragging empty space
      currentTool.dragNone(event, this.graph, x, y);
    }
  }

  rightDownListener(event, x, y) {
    this.rightMousePressed = true;
    this.rightClickStartX = x;
    this.rightClickStartY = y;

    this.panTool.preSelectNone(event, this.graph, x, y);
  }

  rightUpListener(event, x, y) {
    // check if dragging
    if (this.isRightDragging) {
      this.isRightDragging = false;
      this.panTool.dropOnNone(event, this.graph, null, x, y);
    } else if (this.rightMousePressed) {
      // click
      this.panTool.selectNone(event, this.graph, x, y);
    }
    this.rightMousePressed = false;
  }

  rightMoveListener(event, x, y) {
    ui.statusBar.updateMouse(x, y);
    if (!this.isRightDragging) {
      // check for dragging
      if (this.rightMousePressed) {
        // check if mouse movement passes threshold
        let dx = x - this.rightClickStartX;
        let dy = y - this.rightClickStartY;

        if (Math.sqrt(dx * dx + dy * dy) >= this.DRAG_THRESHOLD) {
          this.isRightDragging = true;
          this.wasRightDragging = true;
          this.panTool.preDragNone(this.graph, x, y);
        }
      }
    } else {
      // handle dragging
      this.panTool.dragNone(event, this.graph, x, y);
    }
  }

  contextmenuEventListener(event, x, y, contextMenu) {
    if (this.wasRightDragging) {
      // prevent default context menu
      event.preventDefault();
      this.wasRightDragging = false;
    } else if (event.target === document.getElementById('canvas')) {
      // open context menu if mouse was not right dragging
      contextMenu.contextmenuEventListener(event, x, y);
    }
  }

  contextComponent(event, x, y) {
    if (this.graph.hasComponent(x, y)) {
      this.selectedObject = this.graph.getComponent(x, y);
    }
    return this.selectedObject;
  }

  contextAdd(arg, x, y) {
    if (arg === 'edge') {
      ui.toolbar.selectToolByName('edge');
      ui.toolbar.toolMap.edge.selectNode(this.graph, this.selectedObject);
    } else {
      ui.toolbar.selectToolByName('node');
      ui.toolbar.toolMap.node.addNode(arg, this.graph, x, y);
    }
  }

  contextToggle(arg) {
    this.selectedObject[arg] = !this.selectedObject[arg];
  }

  contextDelete() {
    if (this.selectedObject instanceof Node) {
      this.graph.removeNode(this.selectedObject);
    } else if (this.selectedObject instanceof Edge) {
      this.graph.removeEdge(this.selectedObject);
    } else if (this.selectedObject instanceof Label) {
      this.selectedObject.content = '';
    }
  }

  contextSelect(event, currentTool, x, y) {
    currentTool.selectObject(event, this.graph, this.selectedObject, x, y);
  }
}

export { MouseHandler };
export default MouseHandler;
