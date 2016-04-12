import * as Toolbar from '../ui/toolbar';
import * as StatusBar from '../ui/status-bar';
import * as Sidebar from '../ui/sidebar';
import * as AlgorithmInterface from '../ui/algorithm';

export function init(graph) {
  Toolbar.init();
  StatusBar.init();
  Sidebar.init(graph);
  AlgorithmInterface.init(graph);
}

export function updateZoom(scale) {
  StatusBar.updateZoom(scale);
}

export function updateMouse(x, y) {
  StatusBar.updateMouse(x, y);
}

export function selectObject(obj) {
  // Sidebar.updateSidebar(obj);
}

// function changeTool(tool) {}

// function hoverObject(object) {}
// function clickObject(object) {}
// function dragObject(object) {}
// function dropObject(object) {}

// function updateObject(object) {}
