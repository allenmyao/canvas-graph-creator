import { Tool } from 'tool/tool';
import { Node } from 'data/node/node';
import { SolidEdge } from 'data/edge/solid-edge';
import { DashedEdge } from 'data/edge/dashed-edge';
import * as Sidebar from 'ui/sidebar';

export class EdgeTool extends Tool {

  name = 'Edge Tool';
  sidebarType = 'edge';

  currentMode = 'solid';
  static modes = {
    solid: SolidEdge,
    dashed: DashedEdge
  };

  hasModes() {
    return true;
  }

  start = null;
  dest = null;

  selectNode(graph, node) {
    let EdgeClass = EdgeTool.modes[this.currentMode];
    if (this.start === null) {
      this.start = node;
      this.start.isSelected = true;
    } else if (this.dest === null) {
      this.dest = node;
      graph.addEdge(new EdgeClass(this.start, this.dest));
      this.start.isSelected = false;
      this.start = null;
      this.dest = null;
    }
    Sidebar.updateSidebar();
  }

  selectObject(graph, obj, x, y) {
    if (obj instanceof Node) {
      this.selectNode(graph, obj);
    }
  }

  selectNone(graph, x, y) {
    // deselect?
  }

}
