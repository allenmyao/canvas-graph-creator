import { Tool } from '../tool/tool';
import ui from '../ui/ui';

export class PanTool extends Tool {

  name = 'Pan Tool';

  isPanning = false;
  startPosition = {};

  dragObject(event, graph, srcObj, startX, startY, x, y) {
    this.dragNone(event, graph, startX, startY, x, y);
  }

  dropOnObject(event, graph, droppedObj, destObj, startX, startY, x, y) {
    this.dropOnNone(event, graph, droppedObj, startX, startY, x, y);
  }

  dragNone(event, graph, startX, startY, x, y) {
    if (!this.isPanning) {
      this.isPanning = true;

      this.startPosition.dx = ui.canvas.dx;
      this.startPosition.dy = ui.canvas.dy;
      this.startPosition.x = event.offsetX;
      this.startPosition.y = event.offsetY;
    }

    let scale = ui.canvas.scale;
    ui.canvas.dx = this.startPosition.dx + (this.startPosition.x - event.offsetX) / scale;
    ui.canvas.dy = this.startPosition.dy + (this.startPosition.y - event.offsetY) / scale;
    ui.canvas.update();
  }

  dropOnNone(event, graph, droppedObj, startX, startY, x, y) {
    if (this.isPanning) {
      this.isPanning = false;
    }
  }

}
