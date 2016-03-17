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
        <ul class="data-list">
          <li class="data-item">
            <span class="label">Nodes</span>
            <span class="value">${graph.nodes.size}</span>
          </li>
          <li class="data-item">
            <span class="label">Edges</span>
            <span class="value">${graph.edges.size}</span>
          </li>
        </ul>
      </div>
    `;
  }

  displayNode(node) {
    return `
      <div class="data-container">
        <ul class="data-list">
          <li class="data-item">
            <span class="label">ID</span>
            <span class="value">${node.id}</span>
          </li>
          <li class="data-item">
            <span class="label">Name</span>
            <span class="value">${node.name}</span>
          </li>
          <li class="data-item">
            <span class="label">x</span>
            <span class="value">${node.x}</span>
          </li>
          <li class="data-item">
            <span class="label">y</span>
            <span class="value">${node.y}</span>
          </li>
          <li class="data-item">
            <span class="label">Value</span>
            <span class="value">${node.value}</span>
          </li>
          <li class="data-item">
            <span class="label">Accepting state?</span>
            <span class="value">${node.isAcceptingState}</span>
          </li>
          <li class="data-item">
            <span class="label">Starting state?</span>
            <span class="value">${node.isStartingState}</span>
          </li>
          <li class="data-item">
            <span class="label">Outline</span>
            <span class="value">${node.outline}</span>
          </li>
          <li class="data-item">
            <span class="label">Fill</span>
            <span class="value">${node.fill}</span>
          </li>
          <li class="data-item">
            <span class="label">Line width</span>
            <span class="value">${node.lineWidth}</span>
          </li>
        </ul>
      </div>
    `;
  }

  displayEdge(edge) {
    return `
      <div class="data-container">
        <ul class="data-list">
          <li class="data-item">
            <span class="label">Start node</span>
            <span class="value">#${edge.startNode.id}: (${edge.startNode.x},${edge.startNode.y})</span>
          </li>
          <li class="data-item">
            <span class="label">End node</span>
            <span class="value">#${edge.destNode.id}: (${edge.destNode.x},${edge.destNode.y})</span>
          </li>
          <li class="data-item">
            <span class="label">Cost</span>
            <span class="value">${edge.cost}</span>
          </li>
          <li class="data-item">
            <span class="label">Bezier Point</span>
            <span class="value">(${edge.bezierPoint.x}, ${edge.bezierPoint.y})</span>
          </li>
          <li class="data-item">
            <span class="label">Directed?</span>
            <span class="value">${edge.isDirected}</span>
          </li>
        </ul>
      </div>
    `;
  }
}
