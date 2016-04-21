import SidebarContent from '../ui/sidebar-content';
import { Node } from '../data/node/node';
import { Edge } from '../data/edge/edge';
import * as Form from '../ui/form';

class SidebarSelect extends SidebarContent {
  constructor(graph) {
    super(graph);

    this.selectedObject = null;
  }

  display() {
    this.tabs.replaceTabs({
      data: 'Data'
    });

    this.tabs.setTabContent('data', '<form></form>');

    this.update();
    this.tabs.selectTab('data');

    document.getElementById('sidebar').querySelector('form').addEventListener('input', (event) => {
      this.updateObjectValues(event);
    });

    document.getElementById('sidebar').querySelector('form').addEventListener('change', (event) => {
      this.updateObjectValues(event);
    });
  }

  update(obj) {
    let html;
    if (obj instanceof Node) {
      html = this.displayNode(obj);
      this.selectedObject = obj;
    } else if (obj instanceof Edge) {
      html = this.displayEdge(obj);
      this.selectedObject = obj;
    } else {
      html = this.displayGraph(this.graph);
      this.selectedObject = null;
    }
    this.tabs.getTabContentElement('data').querySelector('form').innerHTML = html;
  }

  updateObjectValues(event) {
    let input = event.target;
    let name = input.name;
    let value = Form.getInputValue(input);
    this.selectedObject[name] = value;
    if (this.selectedObject instanceof Node) {
      for (let edge of this.selectedObject.edges) {
        edge.updateEndpoints();
      }
    }
  }

  displayGraph(graph) {
    return Form.createForm([
      {
        type: 'size',
        value: graph.nodes.size,
        displayName: 'Nodes'
      },
      {
        type: 'size',
        value: graph.edges.size,
        displayName: 'Edges'
      }
    ]);
  }

  displayNode(node) {
    return Form.createForm([
      {
        type: 'number',
        name: 'x',
        value: node.x,
        displayName: 'x'
      },
      {
        type: 'number',
        name: 'y',
        value: node.y,
        displayName: 'y'
      },
      {
        type: 'boolean',
        name: 'isAcceptingState',
        value: node.isAcceptingState,
        displayName: 'Accepting State'
      },
      {
        type: 'boolean',
        name: 'isStartingState',
        value: node.isStartingState,
        displayName: 'Starting State'
      },
      {
        type: 'number',
        name: 'radius',
        value: node.radius,
        displayName: 'Radius'
      },
      {
        type: 'color',
        name: 'color',
        value: node.color,
        displayName: 'Line Color'
      },
      {
        type: 'color',
        name: 'fillColor',
        value: node.fillColor,
        displayName: 'Fill Color'
      },
      {
        type: 'number',
        name: 'lineWidth',
        value: node.lineWidth,
        displayName: 'Line Width'
      },
      {
        type: 'number',
        name: 'xText',
        value: node.xText,
        displayName: 'Label x'
      },
      {
        type: 'number',
        name: 'yText',
        value: node.yText,
        displayName: 'Label y'
      },
      {
        type: 'string',
        name: 'nodeLabel',
        value: node.nodeLabel,
        displayName: 'Label'
      },
      {
        type: 'string',
        name: 'labelFont',
        value: node.labelFont,
        displayName: 'Label font'
      },
      {
        type: 'color',
        name: 'labelColor',
        value: node.labelColor,
        displayName: 'Label color'
      }
    ]);
  }

  displayEdge(edge) {
    return Form.createForm([
      {
        type: 'boolean',
        name: 'isDirected',
        value: edge.isDirected,
        displayName: 'Directed'
      },
      {
        type: 'color',
        name: 'color',
        value: edge.color,
        displayName: 'Color'
      },
      {
        type: 'number',
        name: 'lineWidth',
        value: edge.lineWidth,
        displayName: 'Width'
      },
      {
        type: 'number',
        name: 'xText',
        value: edge.xText,
        displayName: 'Label x'
      },
      {
        type: 'number',
        name: 'yText',
        value: edge.yText,
        displayName: 'Label y'
      },
      {
        type: 'string',
        name: 'edgeLabel',
        value: edge.edgeLabel,
        displayName: 'Label'
      },
      {
        type: 'string',
        name: 'labelFont',
        value: edge.labelFont,
        displayName: 'Label font'
      },
      {
        type: 'color',
        name: 'labelColor',
        value: edge.labelColor,
        displayName: 'Label color'
      }
    ]);
  }
}

export { SidebarSelect };
export default SidebarSelect;
