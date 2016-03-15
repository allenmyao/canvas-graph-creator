import * as UI from 'ui/ui';
import * as Sidebar from 'ui/sidebar';

export class MouseHandler {

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
        this.clickStartX = this.selectedObject.x;
        this.clickStartY = this.selectedObject.y;
      } else {
        this.selectedObject = null;
      }
    } else {
      this.selectedObject = null;
    }
  }

  upListener(event, currentTool, x, y) {
    // check if dragging
    if (this.isDragging) {
      this.isDragging = false;

      // drop object
      // ISSUE: dragged object cannot detect itself (when using tool that doesn't move the object)
      if (this.graph.hasComponent(x, y, this.draggedObject)) {
        currentTool.dropOnObject(event, this.graph, this.draggedObject, this.graph.getComponent(x, y), this.clickStartX, this.clickStartY, x, y);
      } else {
        currentTool.dropOnNone(event, this.graph, this.draggedObject, this.clickStartX, this.clickStartY, x, y);
      }

      this.draggedObject = null;
    } else {
      // click
      let component = null;
      if (this.graph.hasComponent(x, y)) {
        component = this.graph.getComponent(x, y);
      }
      if (component === this.selectedObject) {
        if (component) {
          currentTool.selectObject(event, this.graph, component, x, y);
        } else {
          currentTool.selectNone(event, this.graph, x, y);
        }
      }
    }
    this.mousePressed = false;
    this.selectedObject = null;
    Sidebar.updateSidebar();//placed on intution:  graph is only ever updated outside of sidebar when mouse is let up
  }

  moveListener(event, currentTool, x, y) {
    UI.updateMouse(x, y);

    if (!this.isDragging) {
      // check for dragging
      if (this.mousePressed) {
        // check if mouse movement passes threshold
        let dx = x - this.clickStartX;
        let dy = y - this.clickStartY;

        if (Math.sqrt(dx * dx + dy * dy) >= this.DRAG_THRESHOLD) {
          this.isDragging = true;
          if (this.selectedObject !== null && !currentTool.preDragObject(event, this.graph, this.selectedObject, x, y)) {
            this.selectedObject = null;
            this.draggedObject = null;
          } else {
            this.draggedObject = this.selectedObject;
          }
        }
      } else {
        // regular move
        // hover effect?
      }
    } else {
      // handle dragging
      if (this.draggedObject) {
        currentTool.dragObject(event, this.graph, this.draggedObject, this.clickStartX, this.clickStartY, x, y);
      } else if (this.graph.hasComponent(x, y)) {
        currentTool.dragOverObject(event, this.graph, this.graph.getComponent(x, y), this.clickStartX, this.clickStartY, x, y);
      } else {
        currentTool.dragNone(event, this.graph, this.clickStartX, this.clickStartY, x, y);
      }
    }
  }
}
