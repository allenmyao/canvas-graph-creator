import { Tool } from 'tool/tool';
import * as UI from 'ui/ui';

export class SelectTool extends Tool {

  name = 'Select Tool';

  selectObject(graph, obj, x, y) {
    UI.selectObject(obj);
  }

  // drag: multiselect?

  selectNone(graph, x, y) {
    UI.selectObject(graph);
  }

}
