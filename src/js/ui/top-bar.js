import Dropdown from '../ui/dropdown';

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

    this.inputForm.addEventListener('change', (event) => {
      let input = event.target;
      let name = input.name;
      let value = input.value;
      this.ui.toolbar.currentTool.inputs[name] = value;
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

  showInputs() {
    let currentTool = this.ui.toolbar.currentTool;
    if (currentTool.hasInputs()) {
      let inputTypes = currentTool.inputTypes;
      let inputs = currentTool.inputs;
      let formContent = this.createForm(inputTypes, inputs);
      this.inputForm.innerHTML = formContent;
    } else {
      this.inputForm.innerHTML = '';
    }
  }

  createForm(fields, values) {
    let html = '';

    for (let field of fields) {
      let fieldHtml;

      let type = field.type;
      let name = field.name;
      let value = values[name];
      if (type === 'number') {
        fieldHtml = `<input type="number" name="${name}" value="${value}">`;
      } else if (type === 'boolean') {
        fieldHtml = `<input type="checkbox" name="${name}" ${value ? 'checked="true"' : ''}>`;
      } else if (type === 'string') {
        fieldHtml = `<input type="text" name="${name}" value="${value}">`;
      } else if (type === 'color') {
        fieldHtml = `<input type="color" name="${name}" value="${value}">`;
      } else {
        fieldHtml = `${value}`;
      }

      let displayName = field.displayName;
      html += `
        <fieldset>
          <span class="label">${displayName}</span>
          <span class="value">${fieldHtml}</span>
        </fieldset>`;
    }

    return html;
  }
}

export { TopBar };
export default TopBar;
