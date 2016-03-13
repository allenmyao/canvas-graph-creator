import { Tabs } from 'ui/tabs';

let sidebar;
let tabs;

export function init() {
  sidebar = document.getElementById('sidebar');

  let tabContainer = sidebar.children[0];
  let tabList = tabContainer.children[0];

  tabs = new Tabs(tabContainer, tabList);
  tabs.init();
}

export function getSidebar() {
  return sidebar;
}
