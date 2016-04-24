import SidebarDisplay from '../ui/sidebar-display';
import SidebarSelect from '../ui/sidebar-select';
import SidebarAlgorithm from '../ui/sidebar-algorithm';

/**
 * This class manages the container for sidebar-content subclasses, and is responsible
 * for managing those subclasses as well.
 */
class Sidebar {

  ui;

  sidebar;
  sidebarTypes;
  currentSidebar;
  content;

  constructor(ui) {
    this.ui = ui;
    this.sidebar = document.getElementById('sidebar');
  }

  init(graph) {
    this.sidebarTypes = {
      display: new SidebarDisplay(graph),
      select: new SidebarSelect(graph),
      algorithm: new SidebarAlgorithm(graph)
    };
  }

  setSidebar(sidebarType) {
    if (this.currentSidebar === sidebarType) {
      return;
    }
    this.content = this.sidebarTypes[sidebarType];
    this.content.display();
    this.currentSidebar = sidebarType;
  }

  // Call the current sidebar-content class's update function.
  // Currently, updateSidebar is called only from the mouse-handler.
  updateSidebar(obj) {
    this.content.update(obj);
  }
}

export { Sidebar };
export default Sidebar;
