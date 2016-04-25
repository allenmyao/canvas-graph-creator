import Dropdown from '../ui/dropdown';
import * as Form from '../ui/form';

class TopBar {

  ui;

  topBar;

  modeSelect;

  dropdown;

  inputForm;
  modeInputForm;

  currentMode;
  currentModeElement;

  constructor(ui) {
    this.ui = ui;
    this.topBar = document.getElementById('top-bar');
    this.modeSelect = document.getElementById('mode-select');
    this.inputForm = document.getElementById('tool-inputs-form');
    this.modeInputForm = document.getElementById('tool-mode-inputs-form');
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

    this.modeInputForm.addEventListener('input', (event) => {
      this.updateModeInputValues(event);
    });

    this.modeInputForm.addEventListener('input', (event) => {
      this.updateModeInputValues(event);
    });

    this.modeInputForm.addEventListener('click', (event) => {
      if (event.target.classList.contains('input-select-btn')) {
        this.selectGraphObject(event);
      }
      if (event.target.classList.contains('form__submit-btn')) {
        this.submitModeInputValues(event);
      }
    });
  }

  selectGraphObject(event) {
    let currentTool = this.ui.toolbar.currentTool;
    let output = event.target.parentNode.querySelector('output');
    let input = output.parentNode.querySelector('input[type="hidden"]');

    if (currentTool.currentInput === input) {
      currentTool.currentInput = null;
      if (input.value) {
        event.target.textContent = `Change ${input.getAttribute('data-type')}`;
      } else {
        event.target.textContent = `Select ${input.getAttribute('data-type')}`;
      }
    } else {
      currentTool.currentInput = input;
      event.target.textContent = 'Cancel';
    }
  }

  updateGraphInput(input, obj, hasError) {
    let currentTool = this.ui.toolbar.currentTool;
    if (hasError) {
      currentTool.currentInput = null;
      return;
    }

    let id = obj.id;
    input.value = id;

    let name = input.name;
    let output = input.parentNode.querySelector(`output[name="${name}"]`);
    output.value = `node ${id}`;

    let button = input.parentNode.querySelector('.input-select-btn');
    button.textContent = `Change ${input.getAttribute('data-type')}`;

    currentTool.currentInput = null;
  }

  updateInputValues(event) {
    let input = event.target;
    let name = input.name;
    let value = Form.getInputValue(input);
    this.ui.toolbar.currentTool.inputs[name] = value;
    this.dropdown.updateOptionContent();
  }

  updateModeInputValues(event) {
    let currentTool = this.ui.toolbar.currentTool;
    if (!currentTool.submitModeInputs()) {
      let input = event.target;
      let name = input.name;
      let value = Form.getInputValueLocal(input, this.ui.graph);
      currentTool.modeInputs[name] = value;
    }
  }

  submitModeInputValues(event) {
    let currentTool = this.ui.toolbar.currentTool;
    if (currentTool.submitModeInputs()) {
      let form = this.modeInputForm;
      let data = Form.getData(form, this.ui.graph);

      let hasError = false;

      for (let field of currentTool.modeInputTypes) {
        let name = field.name;
        let showError = !field.test(data[name]);
        Form.displayError(form, name, showError);

        if (showError && !hasError) {
          hasError = true;
        }
      }

      if (hasError) {
        return;
      }

      this.updateAllModeInputValues(data);
      currentTool.submitModeInputsCallback();
    }
  }

  updateAllModeInputValues(inputData) {
    let currentTool = this.ui.toolbar.currentTool;
    for (let name of Object.keys(inputData)) {
      if (name in currentTool.modeInputs) {
        let value = inputData[name];
        currentTool.modeInputs[name] = value;
      }
    }
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

  showModeInputs() {
    let currentTool = this.ui.toolbar.currentTool;
    if (currentTool.hasModeInputs()) {
      let inputTypes = [];
      let inputs = currentTool.modeInputs;
      for (let fieldType of currentTool.modeInputTypes) {
        let field = Object.create(fieldType);
        let name = field.name;
        field.value = inputs[name];
        inputTypes.push(field);
      }
      let formContent = Form.createGraphForm(inputTypes, currentTool.submitModeInputs(), currentTool.submitModeInputsText());
      this.modeInputForm.innerHTML = formContent;
    } else {
      this.modeInputForm.innerHTML = '';
    }
  }
}

export { TopBar };
export default TopBar;
