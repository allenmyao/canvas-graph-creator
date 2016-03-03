import * as Toolbar from 'ui/toolbar';
import * as StatusBar from 'ui/status-bar';

function init() {
    Toolbar.init();
    StatusBar.init();
}

function updateZoom(scale) {
    StatusBar.updateZoom(scale);
}

function updateMouse(x, y) {
    StatusBar.updateMouse(x, y);
}

function updateCanvasPosition(dx, dy) {
    StatusBar.updateCanvasPosition(dx, dy);
}

// function changeTool(tool) {}

// function hoverObject(object) {}
// function clickObject(object) {}
// function dragObject(object) {}
// function dropObject(object) {}

// function updateObject(object) {}

export { init, updateZoom, updateMouse, updateCanvasPosition };
