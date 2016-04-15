import Dropdown from '../ui/dropdown';

// const TOOL_MODE_CLASS = 'mode';
// const TOOL_MODE_NAME_ATTR = 'data-mode';
// const TOOL_MODE_SELECTED_CLASS = 'selected';

class TopBar {

  ui;

  topBar;

  modeSelect;

  dropdown;

  currentMode;
  currentModeElement;

  constructor(ui) {
    this.ui = ui;
    this.topBar = document.getElementById('top-bar');
    this.modeSelect = document.getElementById('mode-select');
    this.dropdown = new Dropdown(this.modeSelect);
    this.initListeners();
  }

  initListeners() {
    this.modeSelect.addEventListener('change', (event) => {
      this.ui.toolbar.currentTool.changeMode(event.target.value);
    });
  }

  showModes() {
    let currentTool = this.ui.toolbar.currentTool;
    if (currentTool.hasModes()) {
      // populate modes list
      let html = '';
      for (let mode of Object.keys(currentTool.constructor.modes)) {
        let selected = mode === currentTool.currentMode ? ' selected="true"' : '';
        html += `<option value="${mode}" ${selected}>${mode}</option>`;
      }

      this.dropdown.optionMap = currentTool.optionMap;
      this.dropdown.optionContent = currentTool.optionContent;
      this.modeSelect.innerHTML = html;
    } else {
      // clear the modes
      this.modeSelect.innerHTML = '';
    }
  }
}

export { TopBar };
export default TopBar;
