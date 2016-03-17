import { SidebarContent } from 'ui/sidebar-content';

export class SidebarNode extends SidebarContent {
  constructor(graph) {
    super(graph);

    this.tabs.replaceTabs({
      node: 'Node'
    });

    this.update();
    this.tabs.selectTab('node');
  }

  update() {
    this.tabs.setTabContent('node', `<span>Number of Nodes: ${this.graph.nodes.size}</span>`);
  }
}
