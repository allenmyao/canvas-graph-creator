import { SidebarContent } from '../ui/sidebar-content';
import * as Form from '../ui/form';
import { Node } from '../data/node/node';
import { Edge } from '../data/edge/edge';

export class SidebarSelect extends SidebarContent {
  constructor(graph) {
    super(graph);

    this.selectedObject = null;

    document.getElementById('sidebar').addEventListener('click', (event) => {
      if (event.target.classList.contains('save-data')) {
        let form = event.target.parentNode;
        let data = Form.getData(form);
        for (let name of Object.keys(data)) {
          this.selectedObject[name] = data[name];
        }
      }
    });
  }

  display() {
    this.tabs.replaceTabs({
      data: 'Data'
    });

    this.update();
    this.tabs.selectTab('data');
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
    this.tabs.setTabContent('data', html);
  }

  displayGraph(graph) {
    return `
      <div class="data-container">
        <form class="data-list">
          <fieldset class="data-item">
            <span class="label col-2">Nodes</span>
            <span class="value col-2">${graph.nodes.size}</span>
          </fieldset>
          <fieldset class="data-item">
            <span class="label col-2">Edges</span>
            <span class="value col-2">${graph.edges.size}</span>
          </fieldset>
        </form>
      </div>
    `;
  }

  displayNode(node) {
    return this.createForm(node, [
      {
        type: 'id',
        name: 'id',
        value: node.id,
        displayName: 'ID'
      },
      {
        type: 'string',
        name: 'nodeLabel',
        value: node.nodeLabel,
        displayName: 'Label'
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
        type: 'number',
        name: 'value',
        value: node.value,
        displayName: 'Value'
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
        type: 'color',
        name: 'outline',
        value: node.outline,
        displayName: 'Line Color'
      },
      {
        type: 'color',
        name: 'fill',
        value: node.fill,
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
    return this.createForm(edge, [
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
        type: 'string',
        name: 'edgeLabel',
        value: edge.edgeLabel,
        displayName: 'Label'
      },
      {
        type: 'number',
        name: 'cost',
        value: edge.cost,
        displayName: 'Cost'
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
      }
    ]);
  }

  createForm(object, fields) {
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
        <fieldset class="data-item">
          <span class="label col-2">${displayName}</span>
          <span class="value col-2">${fieldHtml}</span>
        </fieldset>`;
    }

    return `
      <div class="data-container">
        <form class="data-list">
          ${html}
          <button type="button" class="save-data">Save</button>
        </form>
      </div>
    `;
  }
}
