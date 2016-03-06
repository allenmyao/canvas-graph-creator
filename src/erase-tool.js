import { Tool } from 'tool';
import { Graph } from 'graph';
import { Node } from 'node';
import { Edge } from 'edge';

export class EraseTool extends Tool {

    name = "Erase Tool";

    preSelectObject(graph, obj, x, y) {
        return true;
    }

    preDragObject(graph, srcObj, x, y) {
        return false;
    }

    selectObject(graph, obj, x, y) {
        if (obj instanceof Node) {
            graph.removeNode(obj);
        } else if (obj instanceof Edge) {
            graph.removeEdge(obj);
        }
    }

    dragOverObject(graph, obj, x, y) {
        if (obj instanceof Node) {
            graph.removeNode(obj);
        } else if (obj instanceof Edge) {
            graph.removeEdge(obj);
        }
    }

}
