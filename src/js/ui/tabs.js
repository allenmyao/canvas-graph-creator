const TAB_CLASS = 'tab';
const TAB_ACTIVE_CLASS = 'active';

const TAB_CONTENT_CLASS = 'tab-content';
const TAB_CONTENT_ACTIVE_CLASS = 'active';

const TAB_ATTRIBUTE_NAME = 'data-tab';

export class Tabs {

  constructor(tabContainer, tabList) {
    this.tabContainer = tabContainer;
    this.tabList = tabList;
  }

  selectTabByName(name) {
    this.selectElementByAttribute(TAB_CLASS, TAB_ACTIVE_CLASS, this.tabList, TAB_ATTRIBUTE_NAME, name);
    this.selectElementByAttribute(TAB_CONTENT_CLASS, TAB_CONTENT_ACTIVE_CLASS, this.tabContainer, TAB_ATTRIBUTE_NAME, name);
  }

  selectTabByTarget(targetElement) {
    this.selectElementByTarget(TAB_CLASS, TAB_ACTIVE_CLASS, this.tabList, targetElement);
    this.selectElementByAttribute(TAB_CONTENT_CLASS, TAB_CONTENT_ACTIVE_CLASS, this.tabContainer, TAB_ATTRIBUTE_NAME, targetElement.getAttribute(TAB_ATTRIBUTE_NAME));
  }

  selectElementByAttribute(className, toggleClass, parentElement, attrName, attrVal) {
    this.selectElementByCallback(className, toggleClass, parentElement, (element) => {
      return element.getAttribute(attrName) === attrVal;
    });
  }

  selectElementByTarget(className, toggleClass, parentElement, targetElement) {
    this.selectElementByCallback(className, toggleClass, parentElement, (element) => {
      return element === targetElement;
    });
  }

  selectElementByCallback(className, toggleClass, parentElement, callback) {
    let children = parentElement.children;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      if (child.classList.contains(className)) {
        if (callback(child)) {
          child.classList.add(toggleClass);
        } else {
          child.classList.remove(toggleClass);
        }
      }
    }
  }

}
