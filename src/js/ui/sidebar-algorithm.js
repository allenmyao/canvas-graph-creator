import SidebarContent from '../ui/sidebar-content';
import Node from '../data/node/node';
import Edge from '../data/edge/edge';
import Stepper from '../algorithm/stepper';

class SidebarAlgorithm extends SidebarContent {

  graph;
  stepper;
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
      if (event.target.classList.contains('algorithm-next-btn')) {
        this.stepper.stepForward();
        this.updateStepGUI();
      } else if (event.target.classList.contains('algorithm-prev-btn')) {
        this.stepper.stepBackward();
        this.updateStepGUI();
      } else if (event.target.classList.contains('algorithm-play-btn')) {
        if (!this.stepper.result !== null) {
          this.stepper.play(() => {
            this.updateStepGUI();
          });
        }
      } else if (event.target.classList.contains('algorithm-pause-btn')) {
        if (this.stepper.interval !== null) {
          this.stepper.pause();
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
  }

  updateStepGUI() {
    let description = this.stepper.result.getStepDescription(this.stepper.result.stepIndex);
    let stepNum = this.stepper.result.stepIndex + 2;
    let stepTotal = this.stepper.result.timeline.length + 2;

    let des = document.getElementsByClassName('algorithm-step-des');
    let num = document.getElementsByClassName('algorithm-step-num');

    if (des.length === 1 && num.length === 1) {
      des[0].innerHTML = 'Description:  ' + description;
      num[0].innerHTML = 'Step ' + stepNum + ' of ' + stepTotal;
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

    // this.tabs.setTabContent('algorithm', '');

    this.update();
    this.tabs.selectTab('algorithm');
  }

  updateAlgorithm(algorithm) {
    let html = `
      <div>
        <button type="button" class="algorithm-prev-btn btn-flat">Previous step</button>
        <button type="button" class="algorithm-next-btn btn-flat">Next step</button>
      </div>
      <div>
        <button type="button" class="algorithm-play-btn btn-flat">Play</button>
        <button type="button" class="algorithm-pause-btn btn-flat">Pause</button>
      <div>
      <div>
        <p class="algorithm-step-num"></p>
        <p class="algorithm-step-des"></p>
      </div>
    `;
    this.tabs.getTabContentElement('algorithm').innerHTML = html;
    this.tabs.setTabContent('algorithm', html);
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
    this.updateAlgorithm(this.curAlgorithm);
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
