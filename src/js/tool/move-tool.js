import { Tool } from 'tool/tool';
import { Node } from 'data/node/node';
import * as Sidebar from 'ui/sidebar';

export class MoveTool extends Tool {

  name = 'Move Tool';
  sidebarType = 'select';

  dragObject(graph, obj, startX, startY, x, y) {
    if (obj instanceof Node) {
      obj.x = x;
      obj.y = y;

      for (let edge of obj.edges) {
        edge.updateEndpoints();
      }
    }
    Sidebar.updateSidebar(obj);
  }

  dropOnObject(graph, droppedObj, destObj, startX, startY, x, y) {
    if (destObj instanceof Node) {
      // stop dragging, and reset to starting position
      droppedObj.x = startX;
      droppedObj.y = startY;
    } else {
      this.dropOnNone(graph, droppedObj, startX, startY, x, y);
    }
  }

  dropOnNone(graph, droppedObj, startX, startY, x, y) {
    // check for overlap
    if (droppedObj instanceof Node) {
      if (!graph.isNodeCollision(droppedObj, x, y)) {
        droppedObj.x = x;
        droppedObj.y = y;
      } else {
        droppedObj.x = startX;
        droppedObj.y = startY;
      }
    }
  }

}
