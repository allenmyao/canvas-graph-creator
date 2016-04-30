import SidebarDisplay from '../ui/sidebar-display';
import SidebarSelect from '../ui/sidebar-select';
import SidebarAlgorithm from '../ui/sidebar-algorithm';

/**
 * This class manages the container for sidebar-content subclasses, and is responsible
 * for managing those subclasses as well.
 * @class Sidebar
 */
class Sidebar {

  /**
   * Reference to the UI instance.
   * @type {UI}
   */
  ui;

  /**
   * The sidebar element.
   * @type {Element}
   */
  sidebar;

  /**
   * Map of sidebar names to sidebar content classes.
   * @type {Object.<string,SidebarContent>}
   */
  sidebarTypes;

  /**
   * Name of the current sidebar content type.
   * @type {string}
   */
  currentSidebar;

  /**
   * The current SidebarContent instance that is being displayed.
   * @type {SidebarContent}
   */
  content;

  /**
   * Constructs a Sidebar object.
   * @param  {UI} ui - Reference to the UI instance.
   * @constructs Sidebar
   */
  constructor(ui) {
    this.ui = ui;
    this.sidebar = document.getElementById('sidebar');
  }

  /**
   * Initialization function.
   * @param  {Graph} graph - Graph instance that is used by the sidebar.
   */
  init(graph) {
    this.sidebarTypes = {
      display: new SidebarDisplay(graph),
      select: new SidebarSelect(graph),
      algorithm: new SidebarAlgorithm(graph)
    };
  }

  /**
   * Reset the reference to the graph.
   * @param {Graph} newGraph - The new Graph object.
   */
  resetGraph(newGraph) {
    this.sidebarTypes.display.changeGraph(newGraph);
    this.sidebarTypes.select.changeGraph(newGraph);
    this.sidebarTypes.algorithm.changeGraph(newGraph);
    this.setSidebar('display');
    this.updateSidebar(null);
  }

  /**
   * Set the sidebar content to the specified type.
   * @param {string} sidebarType - Name of the sidebar type to display.
   */
  setSidebar(sidebarType) {
    if (this.currentSidebar === sidebarType) {
      return;
    }
    if (this.currentSidebar === 'algorithm') {
      this.content.resetGraph();
    }
    this.content = this.sidebarTypes[sidebarType];
    this.content.display();
    this.currentSidebar = sidebarType;
  }

  /**
   * Call the current sidebar-content class's update function. Currently, updateSidebar is only from the mouse-handler.
   * @param  {*} obj - Object to update the sidebar with.
   */
  updateSidebar(obj) {
    this.content.update(obj);
  }
}

export { Sidebar };
export default Sidebar;
