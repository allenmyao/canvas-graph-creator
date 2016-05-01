import Tool from '../tool/tool';
import ui from '../ui/ui';

class PanTool extends Tool {

  startPosition = {};

  preSelectNone(event, graph, x, y) {
    this.startPosition.dx = ui.canvas.dx;
    this.startPosition.dy = ui.canvas.dy;
    this.startPosition.x = event.screenX;
    this.startPosition.y = event.screenY;
  }

  dragObject(event, graph, srcObj, x, y) {
    this.dragNone(event, graph, x, y);
  }

  dropOnObject(event, graph, droppedObj, destObj, x, y) {
    this.dropOnNone(event, graph, droppedObj, x, y);
  }

  dragNone(event, graph, x, y) {
    let scale = ui.canvas.scale;
    ui.canvas.dx = this.startPosition.dx + (this.startPosition.x - event.screenX) / scale;
    ui.canvas.dy = this.startPosition.dy + (this.startPosition.y - event.screenY) / scale;
    ui.canvas.update();
  }

  dropOnNone(event, graph, droppedObj, x, y) {
    this.startPosition = {};
  }

}

export { PanTool };
export default PanTool;
