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
    // document.getElementById('tool-modes').addEventListener('click', (event) => {
    //   if (event.target.classList.contains(TOOL_MODE_CLASS)) {
    //     this.selectMode(event.target);
    //   }
    // });
  }

  // selectMode(modeElement) {
  //   this.ui.toolbar.currentTool.changeMode(modeElement.getAttribute(TOOL_MODE_NAME_ATTR));
  //
  //   if (this.currentModeElement) {
  //     this.currentModeElement.classList.remove(TOOL_MODE_SELECTED_CLASS);
  //   }
  //   this.currentModeElement = modeElement;
  //   this.currentModeElement.classList.add(TOOL_MODE_SELECTED_CLASS);
  // }

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
      this.modeSelect.innerHTML = html;
    } else {
      // clear the modes
      this.modeSelect.innerHTML = '';
    }
  }
}

export { TopBar };
export default TopBar;
