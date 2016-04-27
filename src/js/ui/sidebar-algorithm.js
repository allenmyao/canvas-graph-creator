import SidebarContent from '../ui/sidebar-content';
import Node from '../data/node/node';
import Edge from '../data/edge/edge';
import Stepper from '../algorithm/stepper';
import scrollToElement from '../util/scroll-to-element';

class SidebarAlgorithm extends SidebarContent {

  graph;
  stepper;
  curAlgorithm;

  /**
   * Constructor calls the super, creates a new stepper object and then assigns algorithm specific button listeners to the sidebar
   * @param  {graph} graph - Reference to the master graph object
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
        this.stepper.speedUp();
      } else if (event.target.classList.contains('algorithm-slow-down-btn')) {
        this.stepper.slowDown();
      }
    });

    document.getElementById('sidebar').addEventListener('mouseover', (event) => {
      this.hoverEvent(true);
    });

    document.getElementById('sidebar').addEventListener('mouseout', (event) => {
      this.hoverEvent(false);
    });
  }

  hoverEvent(bool) {
    if (event.target.classList.contains('graph-link')) {
      let type = event.target.getAttribute('data-type');
      let id = event.target.getAttribute('data-id');
      this.toggleHover(type, parseInt(id, 10), bool);
    }
  }

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

    this.stepper.setResult(this.curAlgorithm.getResult());

    // TODO immediately display all steps in sidebar
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
    this.tabs.setTabScroll('algorithm', false);
    this.tabs.selectTab('algorithm');
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

  setAlgorithm(AlgorithmClass) {
    this.curAlgorithm = new AlgorithmClass(this.graph);
    this.stepper.reset();

    let html = `
      <div class="algorithm-content">
        <div class="algorithm-controls">
          <button type="button" class="algorithm-prev-btn btn-flat" disabled>Previous step</button>
          <button type="button" class="algorithm-play-toggle-btn btn-flat" disabled>Play</button>
          <button type="button" class="algorithm-next-btn btn-flat" disabled>Next step</button>
          <div class="algorithm-speed">
            <button type="button" class="algorithm-slow-down-btn btn-flat" disabled>Slower</button>
            <button type="button" class="algorithm-speed-up-btn btn-flat" disabled>Faster</button>
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

  resetGraph() {
    this.stepper.resetGraph();
  }

  /**
   * update does nothing now, at this point might not do anything ever since changing the algorithm type occurs in algorithm-tool and the top-bar
   */
  update() {}
}

export { SidebarAlgorithm };
export default SidebarAlgorithm;
