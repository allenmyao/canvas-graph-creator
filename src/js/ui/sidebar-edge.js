import { SidebarContent } from 'ui/sidebar-content';

export class SidebarEdge extends SidebarContent {
  constructor(graph) {
    super(graph);

    this.tabs.replaceTabs({
      edge: 'Edge'
    });

    this.update();
    this.tabs.selectTab('edge');
  }

  update() {
    this.tabs.setTabContent('edge', `<span>Number of Edges: ${this.graph.edges.size}</span>`);
  }
}
