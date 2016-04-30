/**
 * Class for controlling updates to the status bar.
 * @class StatusBar
 */
class StatusBar {

  /**
   * Reference to the UI instance.
   * @type {UI}
   */
  ui;

  /**
   * The element containing the status bar.
   * @type {Element}
   */
  statusBar;

  /**
   * Constructs a StatusBar object.
   * @param  {UI} ui - Reference to the UI instance.
   * @constructs StatusBar
   */
  constructor(ui) {
    this.ui = ui;
    this.statusBar = document.getElementById('status-bar');
    this.initListeners();
  }

  /**
   * Initialize the event listeners.
   */
  initListeners() {
    document.getElementById('reset-transform').addEventListener('click', (event) => {
      this.ui.canvas.reset();
    });
  }

  /**
   * Update the zoom level being displayed.
   * @param  {number} scale - The current scale of the canvas.
   */
  updateZoom(scale) {
    document.getElementById('zoom-input').value = `${Math.round(scale * 100)}%`;
  }

  /**
   * Update the mouse position being displayed.
   * @param  {number} x - x-coordinate of mouse position in canvas coordinates.
   * @param  {number} y - y-coordinate of mouse position in canvas coordinates.
   */
  updateMouse(x, y) {
    document.getElementById('mouse-x').textContent = x.toFixed(2);
    document.getElementById('mouse-y').textContent = y.toFixed(2);
  }

}

export { StatusBar };
export default StatusBar;
