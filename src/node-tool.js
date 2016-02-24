import { Tool } from './tool';
import { Node } from './node';
import { CircleNode } from './circle-node';
import { SquareNode } from './square-node';

export class NodeTool extends Tool {

    name = 'Node Tool';

    currentMode = 'circle';
    static modes = {
        circle: CircleNode,
        square: SquareNode
    };

    hasModes() {
        return true;
    }

    selectObject(graph, obj, x, y) {
        if (!(obj instanceof Node)) {
            this.selectNone(graph, x, y);
        }
    }

    selectNone(graph, x, y) {
        let nodeClass = NodeTool.modes[this.currentMode];
        let node = new nodeClass(x, y);
        if (!graph.isNodeCollision(node, x, y)) {
            graph.addNode(node);
        }
    }

    dropOnNone(graph, droppedObj, startX, startY, x, y) {
        this.selectNone(graph, x, y);
    }

}
