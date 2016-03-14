import { Tabs } from 'ui/tabs';
import { SidebarNode } from 'ui/sidebar-node';
import { SidebarEdge } from 'ui/sidebar-edge';

let sidebar;
let tabs;
let content;
let UIgraph;

/*
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

export function updateSidebar() {
  content.update();
}