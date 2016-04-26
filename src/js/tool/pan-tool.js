import Tool from '../tool/tool';
import ui from '../ui/ui';

class PanTool extends Tool {

  name = 'Pan Tool';

  startPosition = {};

  preSelectNone(event, graph, x, y) {
    this.startPosition.dx = ui.canvas.dx;
    this.startPosition.dy = ui.canvas.dy;
    this.startPosition.x = event.offsetX;
    this.startPosition.y = event.offsetY;
  }

  dragObject(event, graph, srcObj, startX, startY, x, y) {
    this.dragNone(event, graph, startX, startY, x, y);
  }

  dropOnObject(event, graph, droppedObj, destObj, startX, startY, x, y) {
    this.dropOnNone(event, graph, droppedObj, startX, startY, x, y);
  }

  dragNone(event, graph, startX, startY, x, y) {
    let scale = ui.canvas.scale;
    ui.canvas.dx = this.startPosition.dx + (this.startPosition.x - event.offsetX) / scale;
    ui.canvas.dy = this.startPosition.dy + (this.startPosition.y - event.offsetY) / scale;
    ui.canvas.update();
  }

  dropOnNone(event, graph, droppedObj, startX, startY, x, y) {
    this.startPosition = {};
  }

}

export { PanTool };
export default PanTool;
