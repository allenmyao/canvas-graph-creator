import { Tabs } from '../ui/tabs';

/*
*  SidebarContent is a super class
*  This class ensures the proper methods are overloaded, takes in a graph to store so it can use it to access
*  metadata, and starts setting up the tab class.
*
*  Subclasses that extend this superclass must super the constructor and replace the old tabs and content with new tabs
*  and content relevant to their context.  See the sidebar-node and sidebar-edge example classes.
*/
class SidebarContent {
  constructor(graph) {
    let methods = [
      'display',
      'update'
    ];

    for (let method of methods) {
      if (typeof this[method] === 'undefined' || typeof this[method] !== 'function') {
        throw TypeError('Must override method: ' + method);
      }
    }

    this.graph = graph;
    let tabContainer = document.getElementById('sidebar').children[0];
    let tabList = tabContainer.children[0];
    this.tabs = new Tabs(tabContainer, tabList);
    this.tabs.init();
  }

  update() {
    throw Error('Can\'t call draw from abstract SideContent class.');
  }
}

export { SidebarContent };
export default SidebarContent;
