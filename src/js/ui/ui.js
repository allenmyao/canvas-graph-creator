import Toolbar from '../ui/toolbar';
import StatusBar from '../ui/status-bar';
import Sidebar from '../ui/sidebar';
import TopBar from '../ui/top-bar';
import Canvas from '../ui/canvas';
import * as Form from '../ui/form';

/**
 * Class for containing references to all UI controllers.
 * @class UI
 */
class UI {

  /**
   * The current Graph object.
   * @type {Graph}
   */
  graph;

  /**
   * Instance of TopBar.
   * @type {TopBar}
   */
  topBar;

  /**
   * Instance of Toolbar.
   * @type {Toolbar}
   */
  toolbar;

  /**
   * Instance of Sidebar.
   * @type {Sidebar}
   */
  sidebar;

  /**
   * Instance of StatusBar.
   * @type {StatusBar}
   */
  statusBar;

  /**
   * Instance of Canvas.
   * @type {Canvas}
   */
  canvas;

  /**
   * Constructs an instance of UI.
   * @constructs UI
   */
  constructor() {
    this.topBar = new TopBar(this);
    this.toolbar = new Toolbar(this);
    this.sidebar = new Sidebar(this);
    this.statusBar = new StatusBar(this);
    this.canvas = new Canvas(this);
  }

  /**
   * Initialize the UI state.
   * @param  {Graph} graph - The current Graph object.
   */
  init(graph) {
    this.graph = graph;
    this.sidebar.init(graph);
    this.canvas.init(graph);
    Form.init();
  }

  /**
   * Reset the UI state and set a new Graph object as the current graph.
   * @param {Graph} newGraph - The new Graph object.
   */
  resetGraph(newGraph) {
    this.graph = newGraph;
    this.toolbar.reset();
    this.sidebar.resetGraph(newGraph);
    this.canvas.resetGraph(newGraph);
  }
}

const ui = new UI();

export { ui };
export default ui;
