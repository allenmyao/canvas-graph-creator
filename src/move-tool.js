import { Tool } from './tool';
import { Node } from './node';

export class MoveTool extends Tool {

    name = 'Move Tool';

    constructor(icon) {
        super(icon);
    }

    dragObject(graph, obj, x, y) {
        if (obj instanceof Node) {
            obj.x = x;
            obj.y = y;
        }
    }

    dropOnObject(graph, droppedObj, destObj, startX, startY, x, y) {
        console.log('drop on object');
        if (destObj instanceof Node) {
            // stop dragging, and reset to starting position
            droppedObj.x = startX;
            droppedObj.y = startY;
        } else {
            this.dropOnNone(graph, droppedObj, startX, startY, x, y);
        }
    }

    dropOnNone(graph, droppedObj, startX, startY, x, y) {
        console.log('drop on none');
        // check for overlap
        let canDrop = true;
        graph.forEachNode((node) => {
            if (node !== droppedObj && node.distanceToPoint(x, y) < 2 * Node.radius + 10) {
                canDrop = false;
                return false;
            }
        });

        if (canDrop) {
            droppedObj.x = x;
            droppedObj.y = y;
        } else {
            droppedObj.x = startX;
            droppedObj.y = startY;
        }
    }

}
