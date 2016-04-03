import { Tool } from '../tool/tool';
import { Node } from '../data/node/node';

export class MoveTool extends Tool {

  name = 'Move Tool';
  sidebarType = 'select';

  dragObject(event, graph, obj, startX, startY, x, y) {
    if (obj instanceof Node) {
      obj.setPos(x, y);
    }
  }

  dropOnObject(event, graph, droppedObj, destObj, startX, startY, x, y) {
    if (destObj instanceof Node && droppedObj instanceof Node) {
      // stop dragging, and reset to starting position
      droppedObj.setPos(startX, startY);
    } else {
      this.dropOnNone(event, graph, droppedObj, startX, startY, x, y);
    }
  }

  dropOnNone(event, graph, droppedObj, startX, startY, x, y) {
    // check for overlap
    if (droppedObj instanceof Node) {
      if (!graph.isNodeCollision(droppedObj, x, y)) {
        droppedObj.setPos(x, y);
      } else {
        droppedObj.setPos(startX, startY);
      }
    }
  }

}
