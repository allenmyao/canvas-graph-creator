import { Tool } from 'tool';
import { Node } from 'node';
import { Edge } from 'edge';
import { SolidEdge } from 'solid-edge';
import { DashedEdge } from 'dashed-edge';

export class EdgeTool extends Tool {

    name = 'Edge Tool';

    currentMode = 'solid';
    static modes = {
        solid: SolidEdge,
        dashed: DashedEdge
    };

    hasModes() {
        return true;
    }

    start = null;
    dest = null;

    selectNode(graph, node) {
        let edgeClass = EdgeTool.modes[this.currentMode];
        if (this.start === null) {
            this.start = node;
            this.start.isSelected = true;
        } else if (this.dest === null) {
            this.dest = node;
            graph.addEdge(new edgeClass(this.start, this.dest));
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

    selectNone(graph, x, y) {
        // deselect?
    }

}
