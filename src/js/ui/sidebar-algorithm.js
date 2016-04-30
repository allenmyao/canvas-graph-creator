import SidebarContent from '../ui/sidebar-content';
import Node from '../data/node/node';
import Edge from '../data/edge/edge';
import Stepper from '../algorithm/stepper';
import scrollToElement from '../util/scroll-to-element';

/**
 * Sidebar that accompanies the AlgorithmTool.
 * @class SidebarAlgorithm
 */
class SidebarAlgorithm extends SidebarContent {

  /**
   * An instance of a Stepper. Used for stepping through algorithm results.
   * @type {Stepper}
   */
  stepper;

  /**
   * Instance of the current algorithm.
   * @type {AbstractAlgorithm}
   */
  curAlgorithm;

  /**
   * Constructor calls the super, creates a new stepper object and then assigns algorithm specific button listeners to the sidebar
   * @param  {Graph} graph - Reference to the master graph object
   * @constructs SidebarAlgorithm
   */
  constructor(graph) {
    super(graph);
    this.graph = graph;
    this.stepper = new Stepper();
    document.getElementById('sidebar').addEventListener('click', (event) => {
      if (event.target.classList.contains('algorithm-next-btn')) {
        this.stepper.stepForward();
        this.updateStepGUI();
      } else if (event.target.classList.contains('algorithm-prev-btn')) {
        this.stepper.stepBackward();
        this.updateStepGUI();
      } else if (event.target.classList.contains('algorithm-play-toggle-btn')) {
        if (this.stepper.interval !== null) {
          this.stepper.pause();
          event.target.textContent = 'Play';
        } else if (this.stepper.interval === null && this.stepper.result !== null) {
          this.stepper.play(() => {
            this.updateStepGUI();
          });
          event.target.textContent = 'Pause';
        }
      } else if (event.target.classList.contains('algorithm-speed-up-btn')) {
        if (this.stepper.speedUp() === true) {
          let speed = this.tabs.getTabContentElement('algorithm').querySelector('.speed-notch--active');
          if (speed) {
            speed.classList.remove('speed-notch--active');
            speed.nextElementSibling.classList.add('speed-notch--active');
          }
        }
      } else if (event.target.classList.contains('algorithm-slow-down-btn')) {
        if (this.stepper.slowDown() === true) {
          let speed = this.tabs.getTabContentElement('algorithm').querySelector('.speed-notch--active');
          if (speed) {
            speed.classList.remove('speed-notch--active');
            speed.previousElementSibling.classList.add('speed-notch--active');
          }
        }
      }
    });

    document.getElementById('sidebar').addEventListener('mouseover', (event) => {
      this.hoverEvent(true);
    });

    document.getElementById('sidebar').addEventListener('mouseout', (event) => {
      this.hoverEvent(false);
    });
  }

  /**
   * Called to check for hovering over a graph link (link that associates text with an object in the Graph).
   * @param  {boolean} bool - Whether or not the graph link is currently being hovered over.
   */
  hoverEvent(bool) {
    if (event.target.classList.contains('graph-link')) {
      let type = event.target.getAttribute('data-type');
      let id = event.target.getAttribute('data-id');
      this.toggleHover(type, parseInt(id, 10), bool);
    }
  }

  /**
   * Runs the current algorithm and displays the results in the sidebar.
   */
  run() {
    this.stepper.resetGraph();
    this.curAlgorithm.reset();
    for (let inputName of Object.keys(this.curAlgorithm.inputs)) {
      this.curAlgorithm[inputName] = this.curAlgorithm.inputs[inputName];
    }

    let hasNextStep = true;
    while (hasNextStep) {
      hasNextStep = this.curAlgorithm.step();
    }

    this.stepper.setResult(this.curAlgorithm.result);

    this.updateStepGUI();

    let stepsHtml = `
      <li class="stepper__step stepper__step--active" data-index="-1">
        <div class="stepper__step__header">
          <div class="stepper__step__header__number"></div><div class="stepper__step__header__description">Initial state</div>
        </div>
        <div class="stepper__step__details">
          <div class="stepper__step__details__spacer"></div>
          <div class="stepper__step__details__content"></div>
        </div>
      </li>
    `;

    for (let stepIndex = 0; stepIndex < this.stepper.result.timeline.length; stepIndex++) {
      stepsHtml += `
        <li class="stepper__step" data-index="${stepIndex}">
          <div class="stepper__step__header">
            <div class="stepper__step__header__number">${stepIndex + 1}</div><div class="stepper__step__header__description">${this.stepper.result.timeline[stepIndex].description}</div>
          </div>
          <div class="stepper__step__details">
            <div class="stepper__step__details__spacer"></div>
            <div class="stepper__step__details__content"></div>
          </div>
        </li>
      `;
    }

    stepsHtml += `
      <li class="stepper__step" data-index="${this.stepper.result.timeline.length}">
        <div class="stepper__step__header">
          <div class="stepper__step__header__number"></div><div class="stepper__step__header__description">Finished</div>
        </div>
        <div class="stepper__step__details">
          <div class="stepper__step__details__spacer"></div>
          <div class="stepper__step__details__content"></div>
        </div>
      </li>
    `;

    let stepper = this.tabs.getTabContentElement('algorithm').querySelector('.stepper');
    stepper.innerHTML = stepsHtml;

    let prevBtn = document.getElementById('sidebar').querySelector('.algorithm-prev-btn');
    let nextBtn = document.getElementById('sidebar').querySelector('.algorithm-next-btn');
    let playBtn = document.getElementById('sidebar').querySelector('.algorithm-play-toggle-btn');
    let fastBtn = document.getElementById('sidebar').querySelector('.algorithm-speed-up-btn');
    let slowBtn = document.getElementById('sidebar').querySelector('.algorithm-slow-down-btn');
    fastBtn.disabled = false;
    slowBtn.disabled = false;
    prevBtn.disabled = true;
    nextBtn.disabled = false;
    playBtn.disabled = false;
  }

  /**
   * Update the state of the buttons in the sidebar.
   */
  updateStepGUI() {
    let prevBtn = document.getElementById('sidebar').querySelector('.algorithm-prev-btn');
    let nextBtn = document.getElementById('sidebar').querySelector('.algorithm-next-btn');
    let stepIndex = this.stepper.result.stepIndex;
    let maxStepIndex = this.stepper.result.timeline.length;
    if (stepIndex === maxStepIndex) {
      nextBtn.disabled = true;
    } else if (stepIndex === -1) {
      prevBtn.disabled = true;
    }
    if (stepIndex > -1) {
      prevBtn.disabled = false;
    }
    if (stepIndex < maxStepIndex) {
      nextBtn.disabled = false;
    }

    let playBtn = document.getElementById('sidebar').querySelector('.algorithm-play-toggle-btn');
    if (stepIndex === maxStepIndex) {
      playBtn.textContent = 'Play';
      playBtn.disabled = true;
    } else if (stepIndex < maxStepIndex) {
      playBtn.disabled = false;
    }

    let activeStep = this.tabs.getTabContentElement('algorithm').querySelector('.stepper__step--active');
    if (activeStep) {
      activeStep.classList.remove('stepper__step--active');
    }

    let step = this.tabs.getTabContentElement('algorithm').querySelector(`.stepper__step[data-index="${this.stepper.result.stepIndex}"]`);
    if (step) {
      step.classList.add('stepper__step--active');
      let resultsContainer = document.getElementById('sidebar').querySelector('.algorithm-results');
      scrollToElement(resultsContainer, step.offsetTop - resultsContainer.offsetTop - 10, 100, 'easeInOutSine');
    }
  }

  /**
   * Toggle the hover state of the associated Node or Edge when a graph link is being hovered.
   * @param  {string}  type - String containing the type of the object.
   * @param  {number}  id - ID of the object.
   * @param  {boolean} isHovering - Whether or not the mouse is hovering over the graph link.
   */
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

  /**
   * Called when the sidebar content is switched to this.
   * @override
   */
  display() {
    this.tabs.replaceTabs({
      algorithm: 'Algorithm'
    });
    this.tabs.setTabScroll('algorithm', false);
    this.tabs.selectTab('algorithm');
  }

  /**
   * Create a graph link element using the specified Node or Edge.
   * @param  {(Node|Edge)} obj - Node or Edge object to create a graph link for.
   * @return {string} - String containing the HTML for the graph link to the specified Node or Edge.
   */
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

  /**
   * Set the current algorithm to a new instance of the given algorithm class.
   * @param {Object} AlgorithmClass - The algorihtm class
   */
  setAlgorithm(AlgorithmClass) {
    this.curAlgorithm = new AlgorithmClass(this.graph);
    this.stepper.reset();

    let html = `
      <div class="algorithm-content">
        <div class="algorithm-controls">
          <div class="algorithm-step-controls">
            <button type="button" class="algorithm-prev-btn btn-raised" disabled>Previous step</button>
            <button type="button" class="algorithm-play-toggle-btn btn-raised" disabled>Play</button>
            <button type="button" class="algorithm-next-btn btn-raised" disabled>Next step</button>
          </div>
          <div class="algorithm-speed">
            <button type="button" class="algorithm-slow-down-btn btn-raised" disabled>Slower</button>
            <div class="speed-notch"><<</div>
            <div class="speed-notch"><</div>
            <div class="speed-notch speed-notch--active">.</div>
            <div class="speed-notch">></div>
            <div class="speed-notch">>></div>
            <button type="button" class="algorithm-speed-up-btn btn-raised" disabled>Faster</button>
          </div>
        </div>
        <div class="algorithm-results">
          <ul class="stepper"></ul>
        </div>
      </div>
    `;
    this.tabs.getTabContentElement('algorithm').innerHTML = html;
    this.tabs.setTabContent('algorithm', html);
  }

  /**
   * Reset the graph. Calls resetGraph() of the Stepper instance.
   */
  resetGraph() {
    this.stepper.resetGraph();
  }

  /**
   * Update does nothing now, at this point might not do anything ever since changing the algorithm type occurs in algorithm-tool and the top-bar.
   */
  update() {}
}

export { SidebarAlgorithm };
export default SidebarAlgorithm;
