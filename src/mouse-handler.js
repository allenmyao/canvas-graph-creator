import * as UI from 'ui/ui';

export class MouseHandler {

    // distance the mouse needs to move to start a drag
    // this prevents accidentally dragging a few pixels when actually trying to click
    DRAG_THRESHOLD = 7;

    selectedObject = null;
    draggedObject = null;

    clickStartX = null;
    clickStartY = null;
    mousePressed = false;
    isDragging = false;

    constructor(graph) {
        this.graph = graph;
    }

    downListener(event, currentTool, x, y) {
        this.mousePressed = true;
        this.clickStartX = x;
        this.clickStartY = y;

        if (this.graph.hasComponent(x, y)) {
            this.selectedObject = this.graph.getComponent(x, y);
            this.clickStartX = this.selectedObject.x;
            this.clickStartY = this.selectedObject.y;
        }
    }

    upListener(event, currentTool, x, y) {
        // check if dragging
        if (this.isDragging) {
            this.isDragging = false;

            // drop object
            // ISSUE: dragged object cannot detect itself (when using tool that doesn't move the object)
            if (this.graph.hasComponent(x, y, this.draggedObject)) {
                currentTool.dropOnObject(this.graph, this.draggedObject, this.graph.getComponent(x, y), this.clickStartX, this.clickStartY, x, y);
            } else {
                currentTool.dropOnNone(this.graph, this.draggedObject, this.clickStartX, this.clickStartY, x, y);
            }

            this.draggedObject = null;
        } else {
            // click
            if (this.graph.hasComponent(x, y)) {
                currentTool.selectObject(this.graph, this.graph.getComponent(x, y), x, y);
            } else {
                currentTool.selectNone(this.graph, x, y);
            }
        }
        this.mousePressed = false;
        this.selectedObject = null;
    }

    moveListener(event, currentTool, x, y) {
        UI.updateMouse(x, y);

        if (!this.isDragging) {
            // check for dragging
            if (this.mousePressed) {
                // check if mouse movement passes threshold
                let dx = x - this.clickStartX;
                let dy = y - this.clickStartY;

                if (Math.sqrt(dx * dx + dy * dy) >= this.DRAG_THRESHOLD) {
                    this.isDragging = true;
                    this.draggedObject = this.selectedObject;
                }
            } else {
                // regular move
                // hover effect?
            }
        } else {
            // handle dragging
            if (this.draggedObject) {
                currentTool.dragObject(this.graph, this.draggedObject, this.clickStartX, this.clickStartY, x, y);
            } else {
                currentTool.dragNone(this.graph, this.clickStartX, this.clickStartY, x, y);
            }
        }
    }
}
