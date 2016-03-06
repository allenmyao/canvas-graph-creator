import { Tool } from 'tool';

export class SelectTool extends Tool {

  name = 'Select Tool';

  selectObject(graph, obj, x, y) {
    // select
  }

  // drag: multiselect?

  selectNone(graph, x, y) {
    // deselect
  }

}
