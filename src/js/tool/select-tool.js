import { Tool } from '../tool/tool';

export class SelectTool extends Tool {

  name = 'Select Tool';
  sidebarType = 'select';

  selectedObject = null;

  cancel() {
    this.selectNone();
  }

  selectObject(event, graph, obj, x, y) {
    if (this.selectedObject) {
      this.selectedObject.isSelected = false;
    }
    obj.isSelected = true;
    this.selectedObject = obj;
  }

  // drag: multiselect?

  selectNone(event, graph, x, y) {
    if (this.selectedObject) {
      this.selectedObject.isSelected = false;
      this.selectedObject = null;
    }
  }

}
