import ui from '../ui/ui';
import { CircleNode } from '../data/node/circle-node';
import { SquareNode } from '../data/node/square-node';

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

  constructor(graph) {
    this.graph = graph;
  }

  downListener(event, currentTool, x, y) {
    this.mousePressed = true;
    this.clickStartX = x;
    this.clickStartY = y;

    if (this.graph.hasComponent(x, y)) {
      let component = this.graph.getComponent(x, y);
      if (currentTool.preSelectObject(event, this.graph, component, x, y)) {
        this.selectedObject = component;
      } else {
        this.selectedObject = null;
      }
    } else {
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
        currentTool.dropOnObject(event, this.graph, this.draggedObject, this.graph.getComponent(x, y), this.clickStartX, this.clickStartY, x, y);
      } else {
        currentTool.dropOnNone(event, this.graph, this.draggedObject, this.clickStartX, this.clickStartY, x, y);
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
          this.isDragging = true;
          if (this.selectedObject !== null) {
            if (currentTool.preDragObject(event, this.graph, this.selectedObject, x, y)) {
              this.draggedObject = this.selectedObject;
            } else {
              this.selectedObject = null;
              this.draggedObject = null;
            }
          } else {
            currentTool.preDragNone(this.graph, x, y);
            this.draggedObject = this.selectedObject;
          }
        }
      } else {
        // regular move
        // hover effect?
      }
    } else if (this.draggedObject) {
      // handle dragging object
      currentTool.dragObject(event, this.graph, this.draggedObject, this.clickStartX, this.clickStartY, x, y);
      ui.sidebar.updateSidebar(this.draggedObject);
    } else if (this.graph.hasComponent(x, y)) {
      // handle dragging over object
      currentTool.dragOverObject(event, this.graph, this.graph.getComponent(x, y), this.clickStartX, this.clickStartY, x, y);
      ui.sidebar.updateSidebar();
    } else {
      // handle dragging empty space
      currentTool.dragNone(event, this.graph, this.clickStartX, this.clickStartY, x, y);
    }
  }

  contextComponent(event, x, y) {
    let component = null;
    if (this.graph.hasComponent(x, y)) {
      component = this.graph.getComponent(x, y);
    }

    return component;
  }

  contextAdd(arg, x, y) {
    let modes = {
      circle: CircleNode,
      square: SquareNode
    };

    let NodeClass = modes[arg];
    let node = new NodeClass(x, y);

    if (!this.graph.isNodeCollision(node, x, y)) {
      this.graph.addNode(node);
    }
  }

  contextToggle(arg, component) {
    component[arg] = !component[arg];
  }

  contextDelete(arg, component) {
    if (arg === 'node') {
      this.graph.removeNode(component);
    } else if (arg === 'edge') {
      this.graph.removeEdge(component);
    }
  }

  contextSelect(event, currentTool, component, x, y) {
    currentTool.selectObject(event, this.graph, component, x, y);
  }
}

export { MouseHandler };
export default MouseHandler;
