import { Tool } from './tool';
import { Node } from './node';
import { Edge } from './edge';

export class EdgeTool extends Tool {

    name = 'Edge Tool';

    start = null;
    dest = null;

    constructor(icon) {
        super(icon);
    }

    selectNode(graph, node) {
        if (this.start === null) {
            this.start = node;
            this.start.isSelected = true;
        } else if (this.dest === null) {
            this.dest = node;
            graph.addEdge(new Edge(this.start, this.dest));
            this.start.isSelected = false;
            this.start = null;
            this.dest = null;
        }
    }

    selectObject(graph, obj, x, y) {
        if (obj instanceof Node) {
            this.selectNode(graph, obj);
        }
    }

    // mouse events on empty space
    selectNone(graph, x, y) {
        // deselect?
    }

}
