import { Tool } from '../tool/tool';
import Label from '../data/label';

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

    let targetObject;
    if (obj instanceof Label) {
      if (obj.parentObject.containsPoint(x, y)) {
        targetObject = obj.parentObject;
      } else {
        this.selectNone(event, graph, x, y);
      }
    } else {
      targetObject = obj;
    }
    targetObject.isSelected = true;
    this.selectedObject = targetObject;
  }

  selectNone(event, graph, x, y) {
    if (this.selectedObject) {
      this.selectedObject.isSelected = false;
      this.selectedObject = null;
    }
  }

}
