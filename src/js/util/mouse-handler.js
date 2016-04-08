import * as UI from '../ui/ui';
import * as Sidebar from '../ui/sidebar';
import { Node } from '../data/node/node';
import { CircleNode } from '../data/node/circle-node';
import { SquareNode } from '../data/node/square-node';

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
      currentTool.preSelectNone(this.graph, x, y);
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
          Sidebar.updateSidebar(component);
        } else {
          currentTool.selectNone(event, this.graph, x, y);
          Sidebar.updateSidebar();
        }
      } else {
        currentTool.abortSelect(this.graph, x, y);
      }
    }
    this.mousePressed = false;
    this.selectedObject = null;
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
      Sidebar.updateSidebar(this.draggedObject);
    } else if (this.graph.hasComponent(x, y)) {
      // handle dragging over object
      currentTool.dragOverObject(event, this.graph, this.graph.getComponent(x, y), this.clickStartX, this.clickStartY, x, y);
      Sidebar.updateSidebar();
    } else {
      // handle dragging empty space
      currentTool.dragNone(event, this.graph, this.clickStartX, this.clickStartY, x, y);
    }
  }
  
  contextComponent(event, x, y){
      let component = null;
      if(this.graph.hasComponent(x, y)) {
          component = this.graph.getComponent(x, y);
      }
      
      return component;
  }
  
  contextWorker(event, x, y){
      let task = event.srcElement.innerText;
      let component = null;
      if(this.graph.hasComponent(x, y)) {
        component = this.graph.getComponent(x, y);
      }
      if (task == "Add Circle Node"){
        let NodeClass = CircleNode;
        let node = new NodeClass(x,y);
    
        if (!this.graph.isNodeCollision(node, x, y)) {
          this.graph.addNode(node);
        }
      }
      else if (task == "Add Square Node"){
        let NodeClass = SquareNode;
        let node = new NodeClass(x,y);
    
        if (!this.graph.isNodeCollision(node, x, y)) {
          this.graph.addNode(node);
        }
      }
      else if (task == "Toggle Accepting State"){
        component['isAcceptingState'] = !component['isAcceptingState'];
      }
      else if (task == "Toggle Start State"){
        component['isStartState'] = !component['isStartState'];
      }
      else if (task == "Toggle Start State"){
        component['isDirected'] = !component['isDirected'];
      }
      else if (task == "Delete Node"){
        this.graph.removeNode(component);
      }
      else if (task == "Delete Edge"){
        this.graph.removeEdge(component);
      }
    }
  }
