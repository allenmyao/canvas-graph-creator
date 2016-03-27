import { Tool } from 'tool/tool';
import { Node } from 'data/node/node';
import * as Sidebar from 'ui/sidebar';

export class AlgorithmTool extends Tool {

  name = 'Algorithm Tool';
  sidebarType = 'select';

  selectObject(event, graph, obj, x, y) {
    if (obj instanceof Node) {
      Sidebar.updateSidebar(obj);
    }
  }

}
