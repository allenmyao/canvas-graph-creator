import { SidebarContent } from 'ui/sidebar-content';
import * as Form from 'ui/form';
import * as AlgorithmInterface from 'ui/algorithm';

export class SidebarAlgorithm extends SidebarContent {

  currentInput;

  constructor(graph) {
    super(graph);

    document.getElementById('sidebar').addEventListener('click', (event) => {
      if (event.target.classList.contains('run-algorithm-btn')) {
        let form = event.target.parentNode;
        let data = Form.getData(form, this.graph);
        console.log(data);

        AlgorithmInterface.setInputs(data);
        AlgorithmInterface.run();
      } else if (event.target.classList.contains('data-select-btn')) {
        let output = event.target.previousElementSibling;
        let input = output.previousElementSibling;

        let inputName = input.name;
        this.currentInput = inputName;
      }
    });
  }

  display() {
    this.tabs.replaceTabs({
      algorithm: 'Algorithm',
      history: 'History',
      queue: 'Queue'
    });

    this.tabs.setTabContent('algorithm', '');

    this.update();
    this.tabs.selectTab('algorithm');
  }

  updateAlgorithm(algorithm) {
    let form = this.createForm(algorithm.inputs);
    let html = `
      <div class="algorithm-container">
        <div class="section-title">${algorithm.name}</div>
        ${form}
      </div>
    `;
    this.tabs.setTabContent('algorithm', html);
  }

  createForm(inputs) {
    let html = '';

    for (let inputName of Object.keys(inputs)) {
      let fieldHtml;

      let input = inputs[inputName];

      let type = input.type;
      let name = inputName;
      let isRequired = input.required;

      if (type === 'number') {
        fieldHtml = `<input type="number" name="${name}" class="${isRequired ? 'required' : ''}">`;
      } else if (type === 'boolean') {
        fieldHtml = `<input type="checkbox" name="${name}" class="${isRequired ? 'required' : ''}">`;
      } else if (type === 'string') {
        fieldHtml = `<input type="text" name="${name}" class="${isRequired ? 'required' : ''}">`;
      } else if (type === 'color') {
        fieldHtml = `<input type="color" name="${name}" class="${isRequired ? 'required' : ''}">`;
      } else if (type === 'node' || type === 'edge') {
        fieldHtml = `
          <input type="hidden" name="${name}" data-type="${type}" class="${isRequired ? 'required' : ''}">
          <output name="${name}"></output>
          <button type="button" class="data-select-btn">Select Item</button>
        `;
      }

      let displayName = input.name;
      html += `
        <fieldset class="data-item">
          <span class="label col-2">${displayName}</span>
          <span class="value col-2">${fieldHtml}</span>
        </fieldset>
      `;
    }

    return `
      <div class="data-container">
        <form class="data-list">
          ${html}
          <button type="button" class="run-algorithm-btn">Run</button>
        </form>
      </div>
    `;
  }

  getCurrentInput() {
    return this.currentInput;
  }

  updateInput(name, obj) {
    // update displayed input values
    if (name === this.currentInput) {
      let id = obj.id;
      let sidebar = document.getElementById('sidebar');

      let input = sidebar.querySelector(`input[name="${name}"]`);
      input.value = id;

      let output = sidebar.querySelector(`output[name="${name}"]`);
      output.value = `Node ${id}`;
    }
  }

  update(obj) {
    // set start node
  }
}
