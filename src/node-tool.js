import { Tool } from './tool';
import { Node } from './node';

export class NodeTool extends Tool {

    name = 'Node Tool';

    constructor(icon) {
        super(icon);
    }

    selectObject(graph, obj, x, y) {
        if (!(obj instanceof Node)) {
            this.selectNone(graph, x, y);
        }
    }

    // mouse events on empty space
    selectNone(graph, x, y) {
        let isTooClose = false;
        graph.forEachNode((node) => {
            if (node.distanceToPoint(x, y) < 2 * Node.radius + 10) {
                console.log('Too close to node ' + node.id);
                isTooClose = true;
                return false;
            }
        });

        if (!isTooClose) {
            let node = new Node(x, y);
            graph.addNode(node);
        }
    }

    dropOnNone(graph, droppedObj, startX, startY, x, y) {
        this.selectNone(graph, x, y);
    }

}
