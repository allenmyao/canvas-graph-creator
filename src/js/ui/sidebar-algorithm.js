import { SidebarContent } from 'ui/sidebar-content';
import { Node } from 'data/node/node';
import { Edge } from 'data/edge/edge';
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

    document.getElementById('sidebar').addEventListener('mouseover', (event) => {
      if (event.target.classList.contains('graph-link')) {
        let type = event.target.getAttribute('data-type');
        let id = event.target.getAttribute('data-id');
        this.toggleHover(type, parseInt(id, 10), true);
      }
    });

    document.getElementById('sidebar').addEventListener('mouseout', (event) => {
      if (event.target.classList.contains('graph-link')) {
        let type = event.target.getAttribute('data-type');
        let id = event.target.getAttribute('data-id');
        this.toggleHover(type, parseInt(id, 10), false);
      }
    });
  }

  toggleHover(type, id, isHovering) {
    if (type === 'node') {
      this.graph.forEachNode((node) => {
        if (node.id === id) {
          node.isSelected = isHovering;
        }
      });
    } else if (type === 'edge') {
      this.graph.forEachEdge((edge) => {
        if (edge.id === id) {
          edge.isSelected = isHovering;
        }
      });
    }
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

  createLinkElement(obj) {
    let id = obj.id;
    let name;

    let type;
    if (obj instanceof Node) {
      type = 'node';
      name = `Node ${id}`;
    } else if (obj instanceof Edge) {
      type = 'edge';
      name = `Edge ${id}`;
    }

    return `
      <div class="graph-link" data-type="${type}" data-id="${id}">${name}</div>
    `;
  }

  updateHistory(container) {
    let list = '';
    container.forEach((item) => {
      let link = this.createLinkElement(item);
      list = `
        <li class="data-item">
          ${link}
        </li>
        ${list}
      `;
    });

    let html = `
      <div class="data-container">
        <ul class="data-list">
          ${list}
        </ul>
      </div>
    `;

    this.tabs.setTabContent('history', html);
  }

  resetSelected() {
    let tabContent = this.tabs.getTabContentElement('queue');
    let links = tabContent.querySelectorAll('.graph-link');

    for (let i = 0; i < links.length; i++) {
      let link = links[i];
      let type = link.getAttribute('data-type');
      let id = link.getAttribute('data-id');

      console.log(type, id);
      this.toggleHover(type, parseInt(id, 10), false);
    }
  }

  updateQueue(container) {
    this.resetSelected();

    let list = '';
    container.forEach((item) => {
      // TODO: display in 'history' tab
      let link = this.createLinkElement(item);
      list += `
        <li class="data-item">
          ${link}
        </li>
      `;
    });

    let html = `
      <div class="data-container">
        <ul class="data-list">
          ${list}
        </ul>
      </div>
    `;

    this.tabs.setTabContent('queue', html);
  }

  update(obj) {
    // set start node
  }
}
