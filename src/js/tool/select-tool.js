import Tool from '../tool/tool';
import Label from '../data/label';

/**
 * Tool for selecting objects. No longer used directly.
 * @class SelectTool
 */
class SelectTool extends Tool {

  sidebarType = 'select';

  selectedObject = null;

  /**
   * Called when switching to a different tool to cancel any incomplete actions. Cancels object selection.
   */
  cancel() {
    this.selectNone();
  }

  /**
   * Handler for object selection. Select (or deselect if it is currently selected) the object by updating the value of the object's field isSelected.
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {(Node|Edge|Label)} obj - Selected graph component.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   */
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
        return;
      }
    } else {
      targetObject = obj;
    }
    targetObject.isSelected = true;
    this.selectedObject = targetObject;
  }

  /**
   * Handler for clicking empty space. Deselects the selected object (if there is one).
   * @param  {Event} event - Event object from event listener.
   * @param  {Graph} graph - The current graph object.
   * @param  {number} x - Mouse x-coordinate (in canvas coordinates).
   * @param  {number} y - Mouse y-coordinate (in canvas coordinates).
   */
  selectNone(event, graph, x, y) {
    if (this.selectedObject) {
      this.selectedObject.isSelected = false;
      this.selectedObject = null;
    }
  }

}

export { SelectTool };
export default SelectTool;
