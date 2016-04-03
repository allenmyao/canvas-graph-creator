import { Tool } from '../tool/tool';
// import * as UI from 'ui/ui';
// import * as Sidebar from '../ui/sidebar';

export class SelectTool extends Tool {

  name = 'Select Tool';
  sidebarType = 'select';

  selectObject(event, graph, obj, x, y) {
    // UI.selectObject(obj);
    // Sidebar.updateSidebar(obj);
  }

  // drag: multiselect?

  selectNone(event, graph, x, y) {
    // UI.selectObject(graph);
    // Sidebar.updateSidebar(graph);
  }

}
