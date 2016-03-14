import { Tabs } from 'ui/tabs';

export class SidebarContent {
  constructor(graph) {
    let methods = [
      'update'
    ];

    for (let method of methods) {
      if (typeof this[method] === 'undefined' || typeof this[method] !== 'function') {
        throw TypeError('Must override method: ' + method);
      }
    }
    
    this.graph = graph;
    this.tabContainer = document.getElementById('sidebar').children[0];
  }
  
  update() {
    throw Error('Can\'t call draw from abstract SideContent class.');
  }
}