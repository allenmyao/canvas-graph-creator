import NodeTool from '../tool/node-tool';
import EdgeTool from '../tool/edge-tool';
import EraseTool from '../tool/erase-tool';
import PanTool from '../tool/pan-tool';
import SelectMoveTool from '../tool/select-move-tool';
import AlgorithmTool from '../tool/algorithm-tool';

const TOOL_CLASS = 'tool';
const TOOL_NAME_ATTR = 'data-tool';
const TOOL_SELECTED_CLASS = 'btn-primary';

/**
 * Class for controlling state of the toolbar.
 * @class Toolbar
 */
class Toolbar {

  /**
   * Reference to the UI instance.
   * @type {UI}
   */
  ui;

  /**
   * The element containing the toolbar.
   * @type {Element}
   */
  toolbar;

  /**
   * Map of tool names to tool instances.
   * @type {Object.<string,Tool>}
   */
  toolMap = {
    node: new NodeTool(),
    edge: new EdgeTool(),
    erase: new EraseTool(),
    select: new SelectMoveTool(),
    pan: new PanTool(),
    algorithm: new AlgorithmTool()
  };

  /**
   * Name of the curent tool.
   * @type {String}
   */
  currentTool;

  /**
   * Tool button of the current tool.
   * @type {Element}
   */
  currentToolElement;

  /**
   * Constructs a Toolbar instance.
   * @param  {UI} ui - Reference to the UI instance.
   * @constructs Toolbar
   */
  constructor(ui) {
    this.ui = ui;
    this.toolbar = document.getElementById('toolbar');
    this.initListeners();
  }

  /**
   * Initialize event listeners.
   */
  initListeners() {
    this.toolbar.addEventListener('click', (event) => {
      if (event.target.classList.contains(TOOL_CLASS)) {
        this.selectTool(event.target);
      }
    });
  }

  /**
   * Reset the toolbar state.
   */
  reset() {
    this.selectToolByName('node');
  }

  /**
   * Select tool by passing the element associated with it.
   * @param  {Element} toolElement - Button on the toolbar for the tool.
   */
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

    this.currentTool.activate();
    this.currentTool.changeMode(this.currentTool.currentMode);
    this.ui.topBar.showModes();
    this.ui.topBar.showInputs();
    this.ui.topBar.showModeInputs();
  }

  /**
   * Select a tool by name.
   * @param  {string} toolName - Name of the tool.
   */
  selectToolByName(toolName) {
    let toolElement = this.toolbar.querySelector(`.${TOOL_CLASS}[${TOOL_NAME_ATTR}="${toolName}"]`);
    this.selectTool(toolElement);
  }
}

export { Toolbar };
export default Toolbar;
