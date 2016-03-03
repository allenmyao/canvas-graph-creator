let statusBar;

function init() {
    statusBar = document.getElementById('status-bar');
}

function updateZoom(scale) {
    document.getElementById('zoom-input').value = `${1 / scale * 100}%`;
}

function updateMouse(x, y) {
    document.getElementById('mouse-x').textContent = x;
    document.getElementById('mouse-y').textContent = y;
}

function updateCanvasPosition(dx, dy) {
    document.getElementById('canvas-dx').textContent = dx;
    document.getElementById('canvas-dy').textContent = dy;
}

export { init, updateZoom, updateMouse, updateCanvasPosition };
