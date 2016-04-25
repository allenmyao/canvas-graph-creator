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

    // TODO immediately display steps in sidebar
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
    let html = `
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
