import { SidebarContent } from 'ui/sidebar-content';
import { Tabs } from 'ui/tabs';

export class SidebarEdge extends SidebarContent {
  constructor(graph) {
    super(graph);
    this.tabContainer.innerHTML = '<ul class="tab-list"><li class="tab active" data-tab="edge">Edge</li><li class="tab" data-tab="other">Other</li></ul><div class="tab-content active" data-tab="edge"><div><span>Edge</span></div></div><div class="tab-content" data-tab="other"><div><span>other</span></div></div>';
    
    let tabList = this.tabContainer.children[0];
    let tabs = new Tabs(this.tabContainer, tabList);
    
    tabs.init();
    
    this.edgeCount = this.tabContainer.children[1].children[0].children[0];
    this.update();
  }
  
  update() {
    this.edgeCount.innerHTML = "Number of Edges:  " + this.graph.edges.size;
  }
}