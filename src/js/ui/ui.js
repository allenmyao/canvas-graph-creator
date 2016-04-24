import Toolbar from '../ui/toolbar';
import StatusBar from '../ui/status-bar';
import Sidebar from '../ui/sidebar';
import TopBar from '../ui/top-bar';
import Canvas from '../ui/canvas';
import * as Form from '../ui/form';

class UI {

  topBar;
  toolbar;
  sidebar;
  statusBar;
  canvas;

  constructor() {
    this.topBar = new TopBar(this);
    this.toolbar = new Toolbar(this);
    this.sidebar = new Sidebar(this);
    this.statusBar = new StatusBar(this);
    this.canvas = new Canvas(this);
  }

  init(graph) {
    this.sidebar.init(graph);
    this.canvas.init(graph);
    Form.init();
  }
}

const ui = new UI();

export { ui };
export default ui;
