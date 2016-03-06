import { Tool } from './tool';
import { Node } from './node';

export class EditNodeTool extends Tool {

    name = 'Edit Node Tool';

    currentMode = 'startState';
    static modes = {
        startState: 'isStartingState'
    };

    hasModes() {
        return true;
    }

    selectObject(graph, obj, x, y) {
        if (obj instanceof Node) {
            this.selectNone(graph, x, y);
            let nodeAttribute = EditNodeTool.modes[this.currentMode];
            obj[nodeAttribute] = !obj[nodeAttribute];
        }
    }

    dragOverObject(graph, obj, x, y) {
        if (obj instanceof Node) {
            this.selectNone(graph, x, y);
            let nodeAttribute = EditNodeTool.modes[this.currentMode];
            obj[nodeAttribute] = !obj[nodeAttribute];
        }
    }

}
