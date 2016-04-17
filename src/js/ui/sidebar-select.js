import { SidebarContent } from '../ui/sidebar-content';
import { Node } from '../data/node/node';
import { Edge } from '../data/edge/edge';

export class SidebarSelect extends SidebarContent {
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

    document.getElementById('sidebar').querySelector('form').addEventListener('change', (event) => {
      let input = event.target;
      let name = input.name;
      let value;
      if (input.type === 'checkbox') {
        value = input.checked;
      } else if (input.type === 'number') {
        value = parseInt(input.value, 10);
      } else {
        value = input.value;
      }
      this.selectedObject[name] = value;
      if (this.selectedObject instanceof Node) {
        for (let edge of this.selectedObject.edges) {
          edge.updateEndpoints();
        }
      }
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

  displayGraph(graph) {
    return `
      <fieldset>
        <span class="label col-2">Nodes</span>
        <span class="value col-2">${graph.nodes.size}</span>
      </fieldset>
      <fieldset>
        <span class="label col-2">Edges</span>
        <span class="value col-2">${graph.edges.size}</span>
      </fieldset>
    `;
  }

  displayNode(node) {
    return this.createForm([
      {
        type: 'id',
        name: 'id',
        value: node.id,
        displayName: 'ID'
      },
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
    return this.createForm([
      {
        type: 'id',
        name: 'id',
        value: edge.id,
        displayName: 'ID'
      },
      {
        type: 'node',
        value: `#${edge.startNode.id}: (${edge.startNode.x},${edge.startNode.y})`,
        displayName: 'Start'
      },
      {
        type: 'node',
        value: `#${edge.destNode.id}: (${edge.destNode.x},${edge.destNode.y})`,
        displayName: 'End'
      },
      {
        type: 'point',
        value: `(${edge.bezierPoint.x}, ${edge.bezierPoint.y})`,
        displayName: 'Bezier Point'
      },
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

  createForm(fields) {
    let html = '';

    for (let field of fields) {
      let fieldHtml;

      let type = field.type;
      let name = field.name;
      let value = field.value;
      if (type === 'number') {
        fieldHtml = `<input type="number" name="${name}" value="${value}">`;
      } else if (type === 'boolean') {
        fieldHtml = `<input type="checkbox" name="${name}" ${value ? 'checked="true"' : ''}>`;
      } else if (type === 'string') {
        fieldHtml = `<input type="text" name="${name}" value="${value}">`;
      } else if (type === 'color') {
        fieldHtml = `<input type="color" name="${name}" value="${value}">`;
      } else {
        fieldHtml = `${value}`;
      }

      let displayName = field.displayName;
      html += `
        <fieldset>
          <span class="label col-2">${displayName}</span>
          <span class="value col-2">${fieldHtml}</span>
        </fieldset>`;
    }

    return html;
  }
}
