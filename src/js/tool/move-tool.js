import { Tool } from 'tool/tool';
import { Node } from 'data/node/node';

export class MoveTool extends Tool {

  name = 'Move Tool';

  dragObject(graph, obj, startX, startY, x, y) {
    if (obj instanceof Node) {
      obj.setPos(x, y);
    }
  }

  dropOnObject(graph, droppedObj, destObj, startX, startY, x, y) {
    console.log('drop on object');
    if (destObj instanceof Node) {
      // stop dragging, and reset to starting position
      droppedObj.setPos(startX, startY);
    } else {
      this.dropOnNone(graph, droppedObj, startX, startY, x, y);
    }
  }

  dropOnNone(graph, droppedObj, startX, startY, x, y) {
    console.log('drop on none');
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
