import SidebarContent from '../ui/sidebar-content';
import * as Form from '../ui/form';

/**
 * Sidebar content class for displaying graph data. This is the default sidebar type.
 * @class SidebarDisplay
 */
class SidebarDisplay extends SidebarContent {

  /**
   * Constructs a SidebarDisplay instance.
   * @param  {Graph} graph - The current Graph object.
   * @constructs SidebarDisplay
   */
  constructor(graph) {
    super(graph);
  }

  /**
   * Display tabs and update content.
   * @override
   */
  display() {
    this.tabs.replaceTabs({
      data: 'Data'
    });

    this.tabs.setTabContent('data', '<form></form>');

    this.update();
    this.tabs.selectTab('data');
  }

  /**
   * Update the sidebar with data from the graph.
   * @override
   */
  update() {
    let html = Form.createForm([
      {
        type: 'size',
        value: this.graph.nodes.size,
        displayName: 'Nodes'
      },
      {
        type: 'size',
        value: this.graph.edges.size,
        displayName: 'Edges'
      }
    ]);
    this.tabs.getTabContentElement('data').querySelector('form').innerHTML = html;
  }
}

export { SidebarDisplay };
export default SidebarDisplay;
