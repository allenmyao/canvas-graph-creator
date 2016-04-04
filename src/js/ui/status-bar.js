import * as Canvas from '../ui/canvas';

let statusBar;

export function init() {
  statusBar = document.getElementById('status-bar');

  document.getElementById('reset-transform').addEventListener('click', (event) => {
    Canvas.reset();
  });
  document.getElementById('exportGraph').addEventListener('click', (event) => {
    alert("adding export functionality");
  });
}

export function getStatusBar() {
  return statusBar;
}

export function updateZoom(scale) {
  document.getElementById('zoom-input').value = `${scale * 100}%`;
}

export function updateMouse(x, y) {
  document.getElementById('mouse-x').textContent = x;
  document.getElementById('mouse-y').textContent = y;
}

export function updateCanvasPosition(dx, dy) {
  document.getElementById('canvas-dx').textContent = dx;
  document.getElementById('canvas-dy').textContent = dy;
}
