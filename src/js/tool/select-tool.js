import { Tool } from '../tool/tool';
// import * as UI from 'ui/ui';
// import * as Sidebar from '../ui/sidebar';

export class SelectTool extends Tool {

  name = 'Select Tool';
  sidebarType = 'select';

  selectedObject = null;

  selectObject(event, graph, obj, x, y) {
    // UI.selectObject(obj);
    if (this.selectedObject) {
      this.selectedObject.isSelected = false;
    }
    obj.isSelected = true;
    this.selectedObject = obj;
    // Sidebar.updateSidebar(obj);
  }

  // drag: multiselect?

  selectNone(event, graph, x, y) {
    // UI.selectObject(graph);
    if (this.selectedObject) {
      this.selectedObject.isSelected = false;
      this.selectedObject = null;
    }
    // Sidebar.updateSidebar(graph);
  }

}
