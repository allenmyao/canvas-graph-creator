class StatusBar {

  ui;

  statusBar;

  constructor(ui) {
    this.ui = ui;
    this.statusBar = document.getElementById('status-bar');
    this.initListeners();
  }

  initListeners() {
    document.getElementById('reset-transform').addEventListener('click', (event) => {
      this.ui.canvas.reset();
    });
  }

  updateZoom(scale) {
    document.getElementById('zoom-input').value = `${scale.toFixed(2) * 100}%`;
  }

  updateMouse(x, y) {
    document.getElementById('mouse-x').textContent = x.toFixed(2);
    document.getElementById('mouse-y').textContent = y.toFixed(2);
  }

}

export { StatusBar };
export default StatusBar;
