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
      data: 'Data',
      label: 'Label'
    });

    this.tabs.setTabContent('data', '<form></form>');
    this.tabs.setTabContent('label', '<form></form>');
    this.tabs.hideTab('label');

    this.update();
    this.tabs.selectTab('data');

    let forms = document.getElementById('sidebar').querySelectorAll('form');

    for (let i = 0; i < forms.length; i++) {
      let form = forms[i];
      form.addEventListener('input', (event) => {
        this.updateObjectValues(event);
      });

      form.addEventListener('change', (event) => {
        this.updateObjectValues(event);
      });
    }
  }

  update(obj) {
    let html;
    if (obj instanceof Node) {
      html = this.displayNode(obj);
      this.selectedObject = obj;
      this.tabs.showTab('label');
    } else if (obj instanceof Edge) {
      html = this.displayEdge(obj);
      this.selectedObject = obj;
      this.tabs.showTab('label');
    } else {
      html = this.displayGraph(this.graph);
      this.selectedObject = null;
      this.tabs.hideTab('label');
      this.tabs.selectTab('data');
    }
    this.tabs.getTabContentElement('data').querySelector('form').innerHTML = html;
    if (obj instanceof Node || obj instanceof Edge) {
      this.tabs.getTabContentElement('label').querySelector('form').innerHTML = this.displayLabel(obj.label);
    }
  }

  updateObjectValues(event) {
    if (this.tabs.getTabContentElement('data').contains(event.target)) {
      let input = event.target;
      let name = input.name;
      let value = Form.getInputValue(input);
      this.selectedObject[name] = value;
      if (this.selectedObject instanceof Node) {
        for (let edge of this.selectedObject.edges) {
          edge.updateEndpoints();
        }
      }
    } else if (this.tabs.getTabContentElement('label').contains(event.target)) {
      let input = event.target;
      let name = input.name;
      let value = Form.getInputValue(input);
      this.selectedObject.label[name] = value;
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
      }
    ]);
  }

  displayLabel(label) {
    return Form.createForm([
      {
        type: 'number',
        name: 'x',
        value: label.x,
        displayName: 'x'
      },
      {
        type: 'number',
        name: 'y',
        value: label.y,
        displayName: 'y'
      },
      {
        type: 'string',
        name: 'content',
        value: label.content,
        displayName: 'Label'
      },
      {
        type: 'string',
        name: 'fontSize',
        value: label.fontSize,
        displayName: 'Font size'
      },
      {
        type: 'string',
        name: 'fontFamily',
        value: label.fontFamily,
        displayName: 'Font family'
      },
      {
        type: 'color',
        name: 'color',
        value: label.color,
        displayName: 'Color'
      }
    ]);
  }
}

export { SidebarSelect };
export default SidebarSelect;
