import SidebarContent from '../ui/sidebar-content';
import Node from '../data/node/node';
import Edge from '../data/edge/edge';
import * as Form from '../ui/form';
import * as AlgorithmInterface from '../ui/algorithm';

class SidebarAlgorithm extends SidebarContent {

  currentInput;

  constructor(graph) {
    super(graph);

    document.getElementById('sidebar').addEventListener('click', (event) => {
      if (event.target.classList.contains('run-algorithm-btn')) {
        let form = event.target.parentNode;
        let data = Form.getData(form, this.graph);

        let hasError = false;
        let inputs = AlgorithmInterface.getAlgorithmInputs();
        for (let inputName of Object.keys(inputs)) {
          let showError = !inputs[inputName].test(data[inputName]);
          Form.displayError(form, inputName, showError);

          if (showError && !hasError) {
            hasError = true;
          }
        }

        if (hasError) {
          return;
        }
        AlgorithmInterface.setInputValues(data);
        AlgorithmInterface.run();
      } else if (event.target.classList.contains('data-select-btn')) {
        let output = event.target.previousElementSibling;
        let input = output.previousElementSibling;

        let inputName = input.name;
        if (this.currentInput === inputName) {
          this.currentInput = null;
          if (input.value) {
            event.target.textContent = `Change ${input.getAttribute('data-type')}`;
          } else {
            event.target.textContent = `Select ${input.getAttribute('data-type')}`;
          }
        } else {
          this.currentInput = inputName;
          event.target.textContent = 'Cancel';
        }
      } else if (event.target.classList.contains('algorithm-next-btn')) {
        AlgorithmInterface.viewNext();
      } else if (event.target.classList.contains('algorithm-prev-btn')) {
        AlgorithmInterface.viewPrevious();
      } else if (event.target.classList.contains('algorithm-play-btn')) {
        AlgorithmInterface.play();
      } else if (event.target.classList.contains('algorithm-pause-btn')) {
        AlgorithmInterface.pause();
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
      algorithm: 'Algorithm'
    });

    this.tabs.setTabContent('algorithm', '<form></form>');

    this.update();
    this.tabs.selectTab('algorithm');
  }

  updateAlgorithm(algorithm) {
    let form = this.createForm(algorithm.inputs);
    let html = `
      ${form}
      <button type="button" class="run-algorithm-btn">Generate results</button>
      <div>
        <button type="button" class="algorithm-prev-btn">Previous step</button>
        <button type="button" class="algorithm-next-btn">Next step</button>
      </div>
      <div>
        <button type="button" class="algorithm-play-btn">Play</button>
        <button type="button" class="algorithm-pause-btn">Pause</button>
      <div>
      <div>
        <p class="algorithm-step-num">Step #</p>
        <p class="algorithm-step-des">This step is...</p>
      </div>
    `;
    this.tabs.getTabContentElement('algorithm').querySelector('form').innerHTML = html;
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
          <button type="button" class="data-select-btn">Choose ${type}</button>
        `;
      }

      let displayName = input.name;
      html += `
        <fieldset class="${isRequired ? 'required' : ''}" name="${name}">
          <label>${displayName}</label>
          ${fieldHtml}
        </fieldset>
      `;
    }

    return html;
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

      let button = output.nextElementSibling;
      button.textContent = `Change ${input.getAttribute('data-type')}`;

      this.currentInput = null;
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

  update() {}
}

export { SidebarAlgorithm };
export default SidebarAlgorithm;
