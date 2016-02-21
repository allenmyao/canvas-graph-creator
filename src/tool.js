export class Tool {

    name; // displayed name
    icon; // icon to display

    constructor(icon) {
        this.icon = icon;
    }

    // mouse events on graph components
    selectObject(graph, obj, x, y) {

    }

    dragObject(graph, srcObj, x, y) {

    }
    dropOnObject(graph, droppedObj, destObj, startX, startY, x, y) {

    }

    // mouse events on empty space
    selectNone(graph, x, y) {

    }
    dragNone(graph, x, y) {

    }
    dropOnNone(graph, droppedObj, startX, startY, x, y) {

    }
}
