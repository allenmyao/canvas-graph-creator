import Dropdown from '../ui/dropdown';
import * as Form from '../ui/form';

class TopBar {

  ui;

  topBar;

  modeSelect;

  dropdown;

  inputForm;

  currentMode;
  currentModeElement;

  constructor(ui) {
    this.ui = ui;
    this.topBar = document.getElementById('top-bar');
    this.modeSelect = document.getElementById('mode-select');
    this.inputForm = document.getElementById('tool-inputs-form');
    this.dropdown = new Dropdown(this.modeSelect);
    this.initListeners();
  }

  initListeners() {
    this.modeSelect.addEventListener('change', (event) => {
      this.ui.toolbar.currentTool.changeMode(event.target.value);
    });

    this.inputForm.addEventListener('input', (event) => {
      this.updateInputValues(event);
    });

    this.inputForm.addEventListener('change', (event) => {
      this.updateInputValues(event);
    });
  }

  updateInputValues(event) {
    let input = event.target;
    let name = input.name;
    let value = Form.getInputValue(input);
    this.ui.toolbar.currentTool.inputs[name] = value;
    this.dropdown.updateOptionContent();
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

  showInputs() {
    let currentTool = this.ui.toolbar.currentTool;
    if (currentTool.hasInputs()) {
      let inputTypes = Object.create(currentTool.inputTypes);
      let inputs = currentTool.inputs;
      for (let field of inputTypes) {
        let name = field.name;
        field.value = inputs[name];
      }
      let formContent = Form.createForm(inputTypes);
      this.inputForm.innerHTML = formContent;
    } else {
      this.inputForm.innerHTML = '';
    }
  }
}

export { TopBar };
export default TopBar;
