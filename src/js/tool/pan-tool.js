import { Tool } from 'tool/tool';
import * as Canvas from 'ui/canvas';

export class PanTool extends Tool {

  name = 'Pan Tool';

  isPanning = false;
  startPosition = {};

  dragObject(event, graph, srcObj, startX, startY, x, y) {
    this.dragNone(graph, startX, startY, x, y);
  }

  dropOnObject(event, graph, droppedObj, destObj, startX, startY, x, y) {
    this.dropOnNone(graph, droppedObj, startX, startY, x, y);
  }

  dragNone(event, graph, startX, startY, x, y) {
    if (!this.isPanning) {
      this.isPanning = true;

      this.startPosition.dx = Canvas.getDx();
      this.startPosition.dy = Canvas.getDy();
    }

    console.log(`${Canvas.getDx()}, ${Canvas.getDy()}`);
    Canvas.setPosition(this.startPosition.dx - (x - startX), this.startPosition.dy - (y - startY));

    console.log(`${Canvas.getDx()}, ${Canvas.getDy()}`);
    // console.log(`${startX}, ${startY}`);
    // console.log(`${x}, ${y}`);
    Canvas.update();
  }

  dropOnNone(event, graph, droppedObj, startX, startY, x, y) {
    if (this.isPanning) {
      this.isPanning = false;
    }
  }

}
