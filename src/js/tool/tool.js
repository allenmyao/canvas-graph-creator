export class Tool {

  name; // displayed name
  icon; // icon to display

  constructor(icon) {
    this.icon = icon;
  }

  hasModes() {
    return false;
  }

  hasInputs() {
    return false;
  }

  // These is called when changing tools
  // Set up the interface
  activate() {}
  // Undo any incomplete actions
  cancel() {}

  // mouse events on graph components
  preSelectObject(graph, obj, x, y) {
    return true;
  }
  preDragObject(graph, srcObj, x, y) {
    return true;
  }
  selectObject(graph, obj, x, y) {}
  dragObject(graph, srcObj, startX, startY, x, y) {}
  dropOnObject(graph, droppedObj, destObj, startX, startY, x, y) {}
  dragOverObject(graph, obj, startX, startY, x, y) {
    return this.dragNone(graph, startX, startY, x, y);
  }

  // mouse events on empty space
  selectNone(graph, x, y) {}
  dragNone(graph, startX, startY, x, y) {}
  dropOnNone(graph, droppedObj, startX, startY, x, y) {}

}
