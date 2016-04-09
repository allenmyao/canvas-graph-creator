import { Tool } from '../tool/tool';
import { Node } from '../data/node/node';
import { Edge } from '../data/edge/edge';


//current functionality:
//selecting a node with the color tool will change the node to red
export class ColorEdgeTool extends Tool {

  name = 'Color Edge Tool';

  // currentMode = '';
  // static modes = {
    
  // };

  hasModes() {
    return true;
  }



  selectObject(event, graph, obj, x, y) {
    if (obj instanceof Edge) {
      this.selectNone(event, graph, x, y);
      let edgeAttribute = ColorEdgeTool.modes[this.currentMode];
      obj[edgeAttribute] = !obj[edgeAttribute];
    }
  }

}