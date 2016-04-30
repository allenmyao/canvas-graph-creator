const TAB_CLASS = 'tab';
const TAB_ACTIVE_CLASS = 'active';

const TAB_CONTENT_CLASS = 'tab-content';
const TAB_CONTENT_ACTIVE_CLASS = 'active';

const TAB_ATTRIBUTE_NAME = 'data-tab';

/**
 * Class for controlling tabs.
 * @class Tabs
 */
class Tabs {

  /**
   * Constructs a Tabs object.
   * @param  {Element} tabContainer - Container element that holds all the tabs and tab content.
   * @param  {Element} tabList - Parent element of all the tabs.
   * @constructs Tabs
   */
  constructor(tabContainer, tabList) {
    this.tabContainer = tabContainer;
    this.tabList = tabList;
  }

  /**
   * Initialization function to add click event listeners to the tabs.
   */
  init() {
    this.tabList.addEventListener('click', (event) => {
      if (event.target.classList.contains(TAB_CLASS)) {
        this.selectTab(event.target);
      }
    });
  }

  /**
   * Select a specific tab.
   * @param  {(string|Element)} tab - Name of tab or tab element to be selected.
   */
  selectTab(tab) {
    if (typeof tab === 'string') {
      this.selectTabByName(tab);
    } else if (tab instanceof Element) {
      this.selectTabByTarget(tab);
    } else {
      throw Error(`Cannot select tab: ${tab}`);
    }
  }

  /**
   * Set a particular tab's content as the given HTML string.
   * @param  {(string|Element)} tab - Name of tab or tab element.
   * @param {string} content - HTML string containing the tab's new content.
   */
  setTabContent(tab, content) {
    let tabContentElement = this.getTabContentElement(tab);
    tabContentElement.innerHTML = content;
  }

  /**
   * Set whether or not the tab should allow scrolling in the tab content element.
   * @param  {(string|Element)} tab - Name of tab or tab element.
   * @param {boolean} shouldScroll - Whether or not the tab content element should allow scrolling.
   */
  setTabScroll(tab, shouldScroll) {
    if (!shouldScroll) {
      this.getTabContentElement(tab).classList.add('no-scroll');
    }
  }

  /**
   * Add a tab.
   * @param {string} name - Name of the tab. This is used to refer to the tab.
   * @param {string} displayName - String that is displayed on the actual tab.
   */
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

  /**
   * Remove the specified tab.
   * @param  {string} name - Name of the tab to remove.
   */
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

  /**
   * Replace all the tabs with new ones.
   * @param  {Object.<string,string>} names - Object with a map of tab names to tab display names.
   */
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

  /**
   * Hide the tab with the specified name.
   * @param  {string} tabName - Name of the tab to hide.
   */
  hideTab(tabName) {
    this.displayTab(tabName, true);
  }

  /**
   * Show the tab with the specified name.
   * @param  {string} tabName - Name of the tab to show.
   */
  showTab(tabName) {
    this.displayTab(tabName, false);
  }

  /**
   * Set whether or not a tab should be displayed.
   * @param  {string}  tabName - Name of the tab.
   * @param  {boolean} isHiding - Whether or not the tab should be displayed.
   */
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

  /**
   * Update the display status of the tabList element. If there are 1 or fewer tabs, the tabList is hidden.
   */
  updateTabListDisplay() {
    let displayedTabs = this.tabList.querySelectorAll(`.${TAB_CLASS}:not(.hidden)`);
    if (displayedTabs.length <= 1) {
      this.tabContainer.classList.add('hidden-tabs');
    } else {
      this.tabContainer.classList.remove('hidden-tabs');
    }
  }

  /**
   * Get the element associated with the specified tab.
   * @param  {(string|Element)} tab - Name of tab or tab element.
   * @return {Element} - The element containing the tab content.
   */
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

  /**
   * Select the tab with the specified name.
   * @param  {string} name - The name of the tab.
   */
  selectTabByName(name) {
    this.selectElementByAttribute(TAB_CLASS, TAB_ACTIVE_CLASS, this.tabList, TAB_ATTRIBUTE_NAME, name);
    this.selectElementByAttribute(TAB_CONTENT_CLASS, TAB_CONTENT_ACTIVE_CLASS, this.tabContainer, TAB_ATTRIBUTE_NAME, name);
  }

  /**
   * Select the given tab element.
   * @param  {Element} targetElement - The tab element.
   */
  selectTabByTarget(targetElement) {
    if (!targetElement.classList.contains(TAB_CLASS)) {
      throw Error('Target element is not a tab');
    }

    this.selectElementByTarget(TAB_CLASS, TAB_ACTIVE_CLASS, this.tabList, targetElement);
    this.selectElementByAttribute(TAB_CONTENT_CLASS, TAB_CONTENT_ACTIVE_CLASS, this.tabContainer, TAB_ATTRIBUTE_NAME, targetElement.getAttribute(TAB_ATTRIBUTE_NAME));
  }

  /**
   * Toggle selection class for an element (and its siblings) with the specified class, parent element, attribute name, and attribute value. Checks for an element with the specified attribute value for the attribute given.
   * @param  {string} className - Name of the class of the element to select.
   * @param  {string} toggleClass - Class that should be toggled to select the element.
   * @param  {Element} parentElement - Parent element of the element to select.
   * @param  {string} attrName - Name of the attribute to check.
   * @param  {string} attrVal - Value of the attribute to match.
   */
  selectElementByAttribute(className, toggleClass, parentElement, attrName, attrVal) {
    this.selectElementByCallback(className, toggleClass, parentElement, (element) => {
      return element.getAttribute(attrName) === attrVal;
    });
  }

  /**
   * Toggle selection class for an element (and its siblings) with the specified class, parent element, and target element. Checks for an element that matches the target element.
   * @param  {string} className - Name of the class of the element to select.
   * @param  {string} toggleClass - Class that should be toggled to select the element.
   * @param  {Element} parentElement - Parent element of the element to select.
   * @param  {Element} targetElement - Element to select (if it exists).
   */
  selectElementByTarget(className, toggleClass, parentElement, targetElement) {
    this.selectElementByCallback(className, toggleClass, parentElement, (element) => {
      return element === targetElement;
    });
  }

  /**
   * Toggle selection class for an element (and its siblings) with the specified class, parent element, and callback function. The callback should return true or false to select or deselect the elements.
   * @param  {string} className - Name of the class of the element to select.
   * @param  {string} toggleClass - Class that should be toggled to select the element.
   * @param  {Element} parentElement - Parent element of the element to select.
   * @param  {function(element: Element): boolean} callback - Callback function that determines whether the element is selected or not.
   */
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

  /**
   * Get the element with the specified class name and parent element that meets the criteria of a filter function.
   * @param  {string} className - Name of the element class.
   * @param  {Element} parentElement - Parent element of the element.
   * @param  {function(element: Element): boolean} callback - Callback function that determines whether the element should be returned or not.
   * @return {?Element} - Element if a matching one is found, null otherwise.
   */
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

export { Tabs };
export default Tabs;
