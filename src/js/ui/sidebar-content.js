import Tabs from '../ui/tabs';

/**
 * SidebarContent is a super class
 * This class ensures the proper methods are overloaded, takes in a graph to store so it can use it to access
 * metadata, and starts setting up the tab class.
 *
 * Subclasses that extend this superclass must super the constructor and replace the old tabs and content with new tabs
 * and content relevant to their context.  See the sidebar-node and sidebar-edge example classes.
 * @class SidebarContent
 */
class SidebarContent {

  /**
   * The current Graph object.
   * @type {Graph}
   */
  graph;

  /**
   * Instance of Tabs. Controls and provides helper functions for tab functionality.
   * @type {Tabs}
   */
  tabs;

  /**
   * Constructs a SidebarContent instance. This should not be called directly.
   * @param  {Graph} graph - The current Graph object.
   * @constructs SidebarContent
   */
  constructor(graph) {
    this.graph = graph;
    let tabContainer = document.getElementById('sidebar').children[0];
    let tabList = tabContainer.children[0];
    this.tabs = new Tabs(tabContainer, tabList);
    this.tabs.init();
  }

  /**
   * Change the Graph object reference stored to the new one.
   * @param  {Graph} newGraph - The new Graph instance.
   */
  changeGraph(newGraph) {
    this.graph = newGraph;
  }

  /**
   * Display the sidebar.
   * @abstract
   */
  display() {
    throw Error('Can\'t call display from abstract SidebarContent class.');
  }

  /**
   * Update the sidebar state.
   * @abstract
   */
  update() {
    throw Error('Can\'t call update from abstract SidebarContent class.');
  }
}

export { SidebarContent };
export default SidebarContent;
