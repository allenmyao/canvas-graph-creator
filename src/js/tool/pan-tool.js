import { Tool } from '../tool/tool';
import * as Canvas from '../ui/canvas';

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

      this.startPosition.dx = Canvas.getDx();
      this.startPosition.dy = Canvas.getDy();
      this.startPosition.x = event.offsetX;
      this.startPosition.y = event.offsetY;
    }

    let scale = Canvas.getScale();

    Canvas.setPosition(this.startPosition.dx + (this.startPosition.x - event.offsetX) / scale, this.startPosition.dy + (this.startPosition.y - event.offsetY) / scale);
    Canvas.update();
  }

  dropOnNone(event, graph, droppedObj, startX, startY, x, y) {
    if (this.isPanning) {
      this.isPanning = false;
      let scale = Canvas.getScale();
      Canvas.setPosition(this.startPosition.dx + (this.startPosition.x - event.offsetX) / scale, this.startPosition.dy + (this.startPosition.y - event.offsetY) / scale);
      Canvas.update();
    }
  }

}
