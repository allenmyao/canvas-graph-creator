import { Node } from 'data/node/node';
import { Edge } from 'data/edge/edge';
import * as Toolbar from 'ui/toolbar';
import * as StatusBar from 'ui/status-bar';
import * as Sidebar from 'ui/sidebar';

export function init() {
  Toolbar.init();
  StatusBar.init();
  Sidebar.init();
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

export function selectObject(obj) {
  if (obj instanceof Node) {
    Sidebar.displayNode(obj);
  } else if (obj instanceof Edge) {
    Sidebar.displayEdge(obj);
  } else {
    Sidebar.displayGraph(obj);
  }
}

// function changeTool(tool) {}

// function hoverObject(object) {}
// function clickObject(object) {}
// function dragObject(object) {}
// function dropObject(object) {}

// function updateObject(object) {}
