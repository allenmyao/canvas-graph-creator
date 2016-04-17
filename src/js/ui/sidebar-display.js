import SidebarContent from '../ui/sidebar-content';

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
}

export { SidebarDisplay };
export default SidebarDisplay;
