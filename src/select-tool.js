import { Tool } from './tool';
import { Node } from './node';

export class SelectTool extends Tool {

    name = 'Select Tool';

    constructor(icon) {
        super(icon);
    }

    selectObject(graph, obj, x, y) {
        // select
    }

    // drag: multiselect?

    selectNone(graph, x, y) {
        // deselect
    }

}
