import SidebarContent from '../ui/sidebar-content';
import * as Form from '../ui/form';

class SidebarDisplay extends SidebarContent {
  constructor(graph) {
    super(graph);
  }

  display() {
    this.tabs.replaceTabs({
      data: 'Data'
    });

    this.tabs.setTabContent('data', '<form></form>');

    this.update();
    this.tabs.selectTab('data');
  }

  update() {
    let html = this.displayGraph(this.graph);
    this.tabs.getTabContentElement('data').querySelector('form').innerHTML = html;
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
}

export { SidebarDisplay };
export default SidebarDisplay;
