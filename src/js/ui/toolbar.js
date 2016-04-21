import { NodeTool } from '../tool/node-tool';
import { EdgeTool } from '../tool/edge-tool';
import { MoveTool } from '../tool/move-tool';
import { EraseTool } from '../tool/erase-tool';
import { EditNodeTool } from '../tool/editnode-tool';
import { EditEdgeTool } from '../tool/editedge-tool';
import { MetadataTool } from '../tool/metadata-tool';
import { PanTool } from '../tool/pan-tool';
import { SelectTool } from '../tool/select-tool';
import { AlgorithmTool } from 'tool/algorithm-tool';

const TOOL_CLASS = 'tool';
const TOOL_NAME_ATTR = 'data-tool';
const TOOL_SELECTED_CLASS = 'btn-primary';

class Toolbar {

  ui;

  toolbar;
  toolMap = {
    node: new NodeTool(),
    edge: new EdgeTool(),
    move: new MoveTool(),
    erase: new EraseTool(),
    editnode: new EditNodeTool(),
    editedge: new EditEdgeTool(),
    select: new SelectTool(),
    metadata: new MetadataTool(),
    pan: new PanTool(),
    algorithm: new AlgorithmTool()
  };
  currentTool;
  currentToolElement;

  constructor(ui) {
    this.ui = ui;
    this.toolbar = document.getElementById('toolbar');
    this.initListeners();
  }

  initListeners() {
    this.toolbar.addEventListener('click', (event) => {
      if (event.target.classList.contains(TOOL_CLASS)) {
        this.selectTool(event.target);
      }
    });
  }

  selectTool(toolElement) {
    if (this.currentTool) {
      this.currentTool.cancel();
    }

    let toolName = toolElement.getAttribute(TOOL_NAME_ATTR);

    this.currentTool = this.toolMap[toolName];
    this.ui.sidebar.setSidebar(this.currentTool.sidebarType);

    if (this.currentToolElement) {
      this.currentToolElement.classList.remove(TOOL_SELECTED_CLASS);
    }
    this.currentToolElement = toolElement;
    this.currentToolElement.classList.add(TOOL_SELECTED_CLASS);

    this.ui.topBar.showModes();
    this.ui.topBar.showInputs();
    this.showInputs();
    this.currentTool.activate();
    this.currentTool.changeMode(this.currentTool.currentMode);
  }

  selectToolByName(toolName) {
    let toolElement = this.toolbar.querySelector(`.${TOOL_CLASS}[${TOOL_NAME_ATTR}="${toolName}"]`);
    this.selectTool(toolElement);
  }

  showInputs() {
    let inputList = document.getElementById('metadata-tool-inputs');
    if (!(this.currentTool instanceof MetadataTool)) {
      inputList.innerHTML = '';
      return;
    }
    if (this.currentTool.hasInputs()) {
      // populate inputs list
      let html = this.currentTool.getInputHtml();
      inputList.innerHTML = `<ul class="tool-input-list">${html}</ul>`;
    } else {
      // clear the inputs
      inputList.innerHTML = '';
    }
  }
}

export { Toolbar };
export default Toolbar;
