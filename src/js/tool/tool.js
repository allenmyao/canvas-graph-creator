export class Tool {

  name; // displayed name
  icon; // icon to display
  sidebarType = 'select';

  constructor(icon) {
    this.icon = icon;
  }

  hasModes() {
    return typeof this.currentMode !== 'undefined'
        || typeof this.constructor.modes !== 'undefined'
        || typeof this.optionMap !== 'undefined';
  }

  hasInputs() {
    return false;
  }

  changeMode(mode) {
    this.currentMode = mode;
  }

  // These is called when changing tools
  // Set up the interface
  activate() {}
  // Undo any incomplete actions
  cancel() {}

  // mouse events on graph components
  preSelectObject(event, graph, obj, x, y) {
    return true;
  }
  preDragObject(event, graph, srcObj, x, y) {
    return true;
  }
  selectObject(event, graph, obj, x, y) {}
  dragObject(event, graph, srcObj, startX, startY, x, y) {}
  dropOnObject(event, graph, droppedObj, destObj, startX, startY, x, y) {}
  dragOverObject(event, graph, obj, startX, startY, x, y) {
    return this.dragNone(event, graph, startX, startY, x, y);
  }

  // mouse events on empty space
  abortSelect(event, graph, x, y) {}
  preSelectNone(event, graph, x, y) {}
  preDragNone(event, graph, x, y) {}
  selectNone(event, graph, x, y) {}
  dragNone(event, graph, startX, startY, x, y) {}
  dropOnNone(event, graph, droppedObj, startX, startY, x, y) {}

}
