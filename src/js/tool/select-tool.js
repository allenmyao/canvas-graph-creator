import { Tool } from 'tool/tool';
import * as UI from 'ui/ui';

export class SelectTool extends Tool {

  name = 'Select Tool';

  selectObject(event, graph, obj, x, y) {
    UI.selectObject(obj);
  }

  // drag: multiselect?

  selectNone(event, graph, x, y) {
    UI.selectObject(graph);
  }

}
