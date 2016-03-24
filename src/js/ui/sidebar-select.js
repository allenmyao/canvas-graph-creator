import { SidebarContent } from 'ui/sidebar-content';
import { Node } from 'data/node/node';
import { Edge } from 'data/edge/edge';

export class SidebarSelect extends SidebarContent {
  constructor(graph) {
    super(graph);

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
    } else if (obj instanceof Edge) {
      html = this.displayEdge(obj);
    } else {
      html = this.displayGraph(this.graph);
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
        value: node.id,
        displayName: 'ID'
      },
      {
        type: 'string',
        value: node.name,
        displayName: 'Name'
      },
      {
        type: 'number',
        value: node.x,
        displayName: 'x'
      },
      {
        type: 'number',
        value: node.y,
        displayName: 'y'
      },
      {
        type: 'number',
        value: node.value,
        displayName: 'Value'
      },
      {
        type: 'boolean',
        value: node.isAcceptingState,
        displayName: 'Accepting State'
      },
      {
        type: 'boolean',
        value: node.isStartingState,
        displayName: 'Starting State'
      },
      {
        type: 'color',
        value: node.outline,
        displayName: 'Line Color'
      },
      {
        type: 'color',
        value: node.fill,
        displayName: 'Fill Color'
      },
      {
        type: 'color',
        value: node.lineWidth,
        displayName: 'Line Width'
      }
    ]);
  }

  displayEdge(edge) {
    return this.createForm(edge, [
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
        type: 'number',
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
      let value = field.value;
      if (type === 'number') {
        fieldHtml = `<input type="number" name="${field}" value="${value}">`;
      } else if (type === 'boolean') {
        fieldHtml = `<input type="checkbox" name="${field}" ${value ? 'checked="true"' : ''}>`;
      } else if (type === 'string') {
        fieldHtml = `<input type="text" name="${field}" value="${value}">`;
      } else if (type === 'color') {
        fieldHtml = `<input type="color" name="${field}" value="${value}">`;
      } else {
        fieldHtml = `${value}`;
      }

      let displayName = field.displayName || field;
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
        </form>
      </div>
    `;
  }
}
