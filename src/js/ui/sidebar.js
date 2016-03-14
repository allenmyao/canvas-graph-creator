import { Tabs } from 'ui/tabs';
import { SidebarNode } from 'ui/sidebar-node';
import { SidebarEdge } from 'ui/sidebar-edge';

let sidebar;
let tabs;
let content;
let UIgraph;

/*

tools now have a sidebarType, a string, to refer to their associated sidebar sidebar-content subclass

This class manages the container for sidebar-content subclasses, and is responsible
for managing those subclasses as well.

TODO:
changeSidebar should account for if type is not changing
change this into class?
this should have ability to move, minimize, or shrink sidebar
flesh out sidebar-content classes with non placeholder stuff

NOTE:
currently updateSidebar is called only from the mouse-handler up listener
tools must have an associated sidebar type
*/

export function init(graph) {
  UIgraph = graph;
  sidebar = document.getElementById('sidebar');
  content = new SidebarNode(graph);
}

export function changeSidebar(type) {
  if(type == "node") {
    content = new SidebarNode(UIgraph); 
  } else if(type == "edge") {
    content = new SidebarEdge(UIgraph); 
  } 
}

export function getSidebar() {
  return sidebar;
}

//Call the current sidebar-content class's update function
export function updateSidebar() {
  content.update();
}