import * as Toolbar from 'ui/toolbar';
import * as StatusBar from 'ui/status-bar';

export function init() {
    Toolbar.init();
    StatusBar.init();
}

export function updateZoom(scale) {
    StatusBar.updateZoom(scale);
}

export function updateMouse(x, y) {
    StatusBar.updateMouse(x, y);
}

export function updateCanvasPosition(dx, dy) {
    StatusBar.updateCanvasPosition(dx, dy);
}

// function changeTool(tool) {}

// function hoverObject(object) {}
// function clickObject(object) {}
// function dragObject(object) {}
// function dropObject(object) {}

// function updateObject(object) {}
