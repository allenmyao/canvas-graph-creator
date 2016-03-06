import { Tool } from 'tool';
import * as Canvas from 'ui/canvas';

export class PanTool extends Tool {

    name = 'Pan Tool';

    isPanning = false;
    startPosition = {};

    dragObject(graph, srcObj, startX, startY, x, y) {
        this.dragNone(graph, startX, startY, x, y);
    }

    dropOnObject(graph, droppedObj, destObj, startX, startY, x, y) {
        this.dropOnNone(graph, droppedObj, startX, startY, x, y);
    }

    dragNone(graph, startX, startY, x, y) {
        if (!this.isPanning) {
            this.isPanning = true;

            this.startPosition.dx = Canvas.getDx();
            this.startPosition.dy = Canvas.getDy();
        }

        console.log(`${Canvas.getDx()}, ${Canvas.getDy()}`);
        Canvas.setPosition(this.startPosition.dx - (x - startX), this.startPosition.dy - (y - startY));

        console.log(`${Canvas.getDx()}, ${Canvas.getDy()}`);
        // console.log(`${startX}, ${startY}`);
        // console.log(`${x}, ${y}`);
        Canvas.update();
    }

    dropOnNone(graph, droppedObj, startX, startY, x, y) {
        if (this.isPanning) {
            this.isPanning = false;
        }
    }

}
