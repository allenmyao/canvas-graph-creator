import { SidebarContent } from 'ui/sidebar-content';

export class SidebarAlgorithm extends SidebarContent {
  constructor(graph) {
    super(graph);
  }

  display() {
    this.tabs.replaceTabs({
      algorithm: 'Algorithm'
    });

    this.tabs.setTabContent('algorithm', '');

    this.update();
    this.tabs.selectTab('algorithm');
  }

  updateAlgorithm(algorithm) {
    // TODO: display algorithm name and input fields
    this.tabs.setTabContent('algorithm', '');
  }

  updateInput(name, value) {
    // update displayed input values
  }

  update(obj) {
    // set start node
  }
}
