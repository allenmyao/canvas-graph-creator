import MoveTool from './move-tool';
import SelectTool from './select-tool';
import Tool from './tool';

class SelectMoveTool extends Tool {

  sidebarType = 'select';
  selectTool = new SelectTool();
  moveTool = new MoveTool();

  cancel() {
    this.selectTool.cancel();
  }

  selectObject(event, graph, obj, x, y) {
    this.selectTool.selectObject(...arguments);
  }

  selectNone(event, graph, x, y) {
    this.selectTool.selectNone(...arguments);
  }

  preDragObject(event, graph, srcObj, x, y) {
    return this.moveTool.preDragObject(...arguments);
  }

  dragObject(event, graph, obj, x, y) {
    this.selectTool.selectObject(event, graph, obj, x, y);
    this.moveTool.dragObject(...arguments);
  }

  dropOnObject(event, graph, droppedObj, destObj, x, y) {
    this.moveTool.dropOnObject(...arguments);
  }

  dropOnNone(event, graph, droppedObj, x, y) {
    this.moveTool.dropOnNone(...arguments);
  }

}

export { SelectMoveTool };
export default SelectMoveTool;
