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

  init() {
    this.tabList.addEventListener('click', (event) => {
      if (event.target.classList.contains(TAB_CLASS)) {
        this.selectTab(event.target);
      }
    });
  }

  selectTab(tab) {
    if (typeof tab === 'string') {
      this.selectTabByName(tab);
    } else if (tab instanceof Element) {
      this.selectTabByTarget(tab);
    } else {
      throw Error(`Cannot select tab: ${tab}`);
    }
  }

  setTabContent(tab, content) {
    let tabContentElement = this.getTabContentElement(tab);
    tabContentElement.innerHTML = content;
  }

  addTab(name, displayName) {
    let tabs = this.tabList.children;
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].getAttribute(TAB_ATTRIBUTE_NAME) === name) {
        throw Error('Tab with that name already exists');
      }
    }

    let tab = document.createElement('li');
    tab.classList.add(TAB_CLASS);
    tab.textContent = displayName;
    tab.setAttribute(TAB_ATTRIBUTE_NAME, name);

    let tabContent = document.createElement('div');
    tabContent.classList.add(TAB_CONTENT_CLASS);
    tabContent.setAttribute(TAB_ATTRIBUTE_NAME, name);

    this.tabList.appendChild(tab);
    this.tabContainer.appendChild(tabContent);
    this.updateTabListDisplay();
  }

  removeTab(name) {
    let tabs = this.tabList.children;
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].getAttribute(TAB_ATTRIBUTE_NAME) === name) {
        tabs[i].remove();
        this.getTabContentElement(name).remove();
        this.updateTabListDisplay();
        return;
      }
    }
    throw Error('Tab does not exists');
  }

  replaceTabs(names) {
    while (this.tabList.firstChild) {
      let tab = this.tabList.firstChild;
      this.tabList.removeChild(tab);
      if (tab.nodeType === Node.ELEMENT_NODE) {
        this.getTabContentElement(tab).remove();
      }
    }

    for (let name of Object.keys(names)) {
      this.addTab(name, names[name]);
    }

    this.updateTabListDisplay();
  }

  hideTab(tabName) {
    this.displayTab(tabName, true);
  }

  showTab(tabName) {
    this.displayTab(tabName, false);
  }

  displayTab(tabName, isHiding) {
    let tabs = this.tabList.querySelectorAll(`.${TAB_CLASS}[${TAB_ATTRIBUTE_NAME}=${tabName}]`);
    for (let i = 0; i < tabs.length; i++) {
      let tab = tabs[i];
      if (isHiding) {
        tab.classList.add('hidden');
      } else {
        tab.classList.remove('hidden');
      }
    }
    this.updateTabListDisplay();
  }

  updateTabListDisplay() {
    let displayedTabs = this.tabList.querySelectorAll(`.${TAB_CLASS}:not(.hidden)`);
    if (displayedTabs.length <= 1) {
      this.tabList.classList.add('hidden');
    } else {
      this.tabList.classList.remove('hidden');
    }
  }

  getTabContentElement(tab) {
    let name;
    if (typeof tab === 'string') {
      name = tab;
    } else if (tab instanceof Element) {
      name = tab.getAttribute(TAB_ATTRIBUTE_NAME);
    } else {
      throw Error(`Cannot get tab content for: ${tab}`);
    }

    return this.getElementByCallback(TAB_CONTENT_CLASS, this.tabContainer, (child) => {
      return child.getAttribute(TAB_ATTRIBUTE_NAME) === name;
    });
  }

  selectTabByName(name) {
    this.selectElementByAttribute(TAB_CLASS, TAB_ACTIVE_CLASS, this.tabList, TAB_ATTRIBUTE_NAME, name);
    this.selectElementByAttribute(TAB_CONTENT_CLASS, TAB_CONTENT_ACTIVE_CLASS, this.tabContainer, TAB_ATTRIBUTE_NAME, name);
  }

  selectTabByTarget(targetElement) {
    if (!targetElement.classList.contains(TAB_CLASS)) {
      throw Error('Target element is not a tab');
    }

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

  getElementByCallback(className, parentElement, callback) {
    let children = parentElement.children;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      if (child.classList.contains(className)) {
        if (callback(child)) {
          return child;
        }
      }
    }
    return null;
  }

}
