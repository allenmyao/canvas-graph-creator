import { Tabs } from 'ui/tabs';

let sidebar;
let tabs;

export function init() {
  sidebar = document.getElementById('sidebar');

  let tabContainer = sidebar.children[0];
  let tabList = tabContainer.children[0];

  tabs = new Tabs(tabContainer, tabList);
  tabs.init();
}

export function getSidebar() {
  return sidebar;
}

export function displayGraph(graph) {
  let html = `
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

  tabs.setTabContent('data', html);
}

export function displayNode(node) {
  let html = `
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

  tabs.setTabContent('data', html);
}

export function displayEdge(edge) {
  let html = `
    <div class="data-container">
      <ul class="data-list">
        <li class="data-item">
          <span class="label">Start node</span>
          <span class="value">${edge.startNode}</span>
        </li>
        <li class="data-item">
          <span class="label">End node</span>
          <span class="value">${edge.destNode}</span>
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

  tabs.setTabContent('data', html);
}
