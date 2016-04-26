import SidebarContent from '../ui/sidebar-content';
import Node from '../data/node/node';
import Edge from '../data/edge/edge';
import * as Form from '../ui/form';
import Stepper from '../algorithm/stepper';

class SidebarAlgorithm extends SidebarContent {

  currentInput;
  graph;
  stepper;
  algoInputs;
  curAlgorithm;

  /**
   * Constructor calls the super, creates a new stepper object and then assigns algorithm specific button listeners to the sidebar
   * @param  {graph} graph - Reference to the master graph object
   */
  constructor(graph) {
    super(graph);
    this.graph = graph;
    this.stepper = new Stepper();
    document.getElementById('sidebar').addEventListener('click', (event) => {
      if (event.target.classList.contains('run-algorithm-btn')) {
        this.runEvent();
      } else if (event.target.classList.contains('data-select-btn')) {
        this.selectEvent();
      } else if (event.target.classList.contains('algorithm-next-btn')) {
        this.stepper.stepForward();
      } else if (event.target.classList.contains('algorithm-prev-btn')) {
        this.stepper.stepBackward();
      } else if (event.target.classList.contains('algorithm-play-btn')) {
        if (!(this.stepper.result === null)) {
          this.stepper.play();
        }
      } else if (event.target.classList.contains('algorithm-pause-btn')) {
        this.stepper.pause();
      }
    });

    document.getElementById('sidebar').addEventListener('mouseover', (event) => {
      this.hoverEvent(event, true);
    });

    document.getElementById('sidebar').addEventListener('mouseout', (event) => {
      this.hoverEvent(event, false);
    });
  }

  hoverEvent(event, bool) {
    if (event.target.classList.contains('graph-link')) {
      let type = event.target.getAttribute('data-type');
      let id = event.target.getAttribute('data-id');
      this.toggleHover(type, parseInt(id, 10), bool);
    }
  }

  selectEvent() {
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
  }

  runEvent() {
    let form = event.target.parentNode;
    let data = Form.getData(form, this.graph);

    let hasError = false;
    for (let inputName of Object.keys(this.algoInputs)) {
      let showError = !this.algoInputs[inputName].test(data[inputName]);
      Form.displayError(form, inputName, showError);

      if (showError && !hasError) {
        hasError = true;
      }
    }

    if (hasError) {
      return;
    }
    this.setInputValues(data);
    this.run();
  }

  setInputValues(inputData) {
    for (let name of Object.keys(inputData)) {
      if (name in this.algoInputs) {
        let value = inputData[name];
        this.curAlgorithm[name] = value;
      }
    }
  }

  run() {
    let hasNextStep = true;
    while (hasNextStep) {
      hasNextStep = this.curAlgorithm.step();
    }
    this.stepper.setResult(this.curAlgorithm.getResult());
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

  selectObject(obj) {
    if (this.currentInput && this.algoInputs && this.algoInputs[this.currentInput].test(obj)) {
      this.updateInput(this.currentInput, obj);
    }
  }

  setAlgorithm(AlgorithmClass) {
    this.curAlgorithm = new AlgorithmClass(this.graph);
    this.algoInputs = this.curAlgorithm.inputs;

    this.stepper.reset();

    this.updateAlgorithm(this.curAlgorithm);
  }

  resetGraph() {
    if (!(this.stepper.result === null)) {
      this.stepper.resetGraph();
    }
  }

  /**
   * update does nothing now, at this point might not do anything ever since changing the algorithm type occurs in algorithm-tool and the top-bar
   */
  update() {}
}

export { SidebarAlgorithm };
export default SidebarAlgorithm;
