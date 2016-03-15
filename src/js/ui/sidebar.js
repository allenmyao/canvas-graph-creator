import { SidebarNode } from 'ui/sidebar-node';
import { SidebarEdge } from 'ui/sidebar-edge';

let sidebar;
let tabs;
let content;
let UIgraph;

/*

tools now have a sidebarType, a string, to refer to their associated sidebar sidebar-content subclass

This class manages the container for sidebar-content subclasses, and is responsible
for managing those subclasses as well.

TODO:
changeSidebar should account for if type is not changing
change this into class?
this should have ability to move, minimize, or shrink sidebar
flesh out sidebar-content classes with non placeholder stuff
select tool needs reference to selected object

NOTE:
currently updateSidebar is called only from the mouse-handler up listener
tools must have an associated sidebar type
*/

export function init(graph) {
  UIgraph = graph;
  sidebar = document.getElementById('sidebar');
  content = new SidebarNode(graph);
}

export function changeSidebar(type) {
  if (type === 'node') {
    content = new SidebarNode(UIgraph);
  } else if (type === 'edge') {
    content = new SidebarEdge(UIgraph);
  }
}

export function getSidebar() {
  return sidebar;
}

// Call the current sidebar-content class's update function
export function updateSidebar() {
  content.update();
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
