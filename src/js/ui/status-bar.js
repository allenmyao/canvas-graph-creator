import * as Canvas from '../ui/canvas';

let statusBar;

export function init() {
  statusBar = document.getElementById('status-bar');

  document.getElementById('reset-transform').addEventListener('click', (event) => {
    Canvas.reset();
  });
}

export function getStatusBar() {
  return statusBar;
}

export function updateZoom(scale) {
  document.getElementById('zoom-input').value = `${scale.toFixed(2) * 100}%`;
}

export function updateMouse(x, y) {
  document.getElementById('mouse-x').textContent = x.toFixed(2);
  document.getElementById('mouse-y').textContent = y.toFixed(2);
}
