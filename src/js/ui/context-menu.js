import Node from '../data/node/node';
import Edge from '../data/edge/edge';

const MENU_TOGGLE_CLASS = 'context-menu--active';

const MENU_SECTION_CLASS = 'context-menu__section';
const MENU_SECTION_VISIBILITY_CLASS = 'context-menu__section--visible';
const MENU_SECTION_NAME_ATTRIBUTE = 'data-name';

const MENU_ITEM_TYPE_ATTRIBUTE = 'data-type';
const MENU_ITEM_DATA_ATTRIBUTE = 'data-data';

/**
 * The context menu html object which reacts to context clicks
 * @class ContextMenu
 */
class ContextMenu {

  /**
   * An instance of the UI
   * @type {UI}
   */
  ui;

  /**
   * An instance of the mouseHandler which interfaces the canvas with the graph
   * @type {MouseHandler}
   */
  mouseHandler;

  /**
   * An instance of the HTMLElement for the context menu
   * @type {HTMLElement}
   */
  contextMenu;

  /**
   * A boolean variable which tracks whether or not the context menu is displayed
   * @type {Boolean}
   */
  isDisplayed = false;

  /**
   * A number variable which tracks the x-position of the context menu
   * @type {Number}
   */
  menuPosX;

  /**
   * A number variable which tracks the y-position of the context menu
   * @type {Number}
   */
  menuPosY;

  /**
   * The currently selected component, can either be a node, an edge, or null
   * @type {Object}
   */
  component;

  /**
   * Constructor for the context menu class
   * @param {UI} ui -  reference to the master UI object
   * @param {MouseHandler} mouseHandler - reference to the master mouseHandler object
   */
  constructor(ui, mouseHandler) {
    this.ui = ui;
    this.mouseHandler = mouseHandler;
    this.contextMenu = document.getElementById('context-menu');
    this.initListeners();
  }

  /**
   * Initializes the listeners for clicks upon the context-menu element
   */
  initListeners() {
    this.contextMenu.addEventListener('mouseup', (event) => {
      let type = event.target.getAttribute(MENU_ITEM_TYPE_ATTRIBUTE);
      let value = event.target.getAttribute(MENU_ITEM_DATA_ATTRIBUTE);

      if (type === 'add') {
        this.mouseHandler.contextAdd(value, this.menuPosX, this.menuPosY);
      } else if (type === 'toggle') {
        this.mouseHandler.contextToggle(value);
      } else if (type === 'delete') {
        this.mouseHandler.contextDelete();
      } else if (type === 'edit') {
        this.mouseHandler.contextSelect(event, this.ui.toolbar.currentTool, this.menuPosX, this.menuPosY);
      } else if (type === 'save') {
        let downloadLink = document.createElement('a');
        downloadLink.href = this.ui.canvas.canvas.toDataURL('image/png');
        downloadLink.download = 'canvas.png';
        downloadLink.target = '_blank';
        document.body.appendChild(downloadLink);
        downloadLink.dispatchEvent(new MouseEvent('click'));
        document.body.removeChild(downloadLink);
      }

      if (event.button !== 2) {
        this.toggleContextMenu();
      }
    });

    this.contextMenu.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      this.toggleContextMenu();
    });

    document.addEventListener('click', (event) => {
      if (!this.contextMenu.contains(event.target)) {
        if (this.isDisplayed) {
          this.toggleContextMenu();
        }
      }
    });
  }

  toggleContextMenu() {
    if (this.isDisplayed) {
      this.contextMenu.classList.remove(MENU_TOGGLE_CLASS);
    } else {
      this.contextMenu.classList.add(MENU_TOGGLE_CLASS);
    }
    this.isDisplayed = !this.isDisplayed;
  }

  /**
   * Repositions the context menu based on where the click was adjusting for clicks that might place the context menu off screen
   * @param {HTMLEvent} event - click event that toggles the context menu opening
   */
  repositionMenu(event) {
    let xpos = event.clientX;
    let ypos = event.clientY;

    this.contextMenu.style.left = xpos + 'px';
    this.contextMenu.style.top = ypos + 'px';

    let distanceRight = document.body.offsetWidth - xpos - this.contextMenu.offsetWidth;
    let distanceBottom = document.body.offsetHeight - ypos - this.contextMenu.offsetHeight;

    if (distanceRight < 0) {
      this.contextMenu.style.left = `${xpos + distanceRight}px`;
    }
    if (distanceBottom < 0) {
      this.contextMenu.style.top = `${ypos - this.contextMenu.offsetHeight}px`;
    }
  }

  /**
   * Function called by canvas when context menu click happens
   * @param {HTMLEvent} event - click event that toggles the context menu opening
   * @param {Number} x - x position of the click event
   * @param {Number} y - y position of the click event
   */
  contextmenuEventListener(event, x, y) {
    this.menuPosX = x;
    this.menuPosY = y;

    this.component = this.mouseHandler.contextComponent(event, this.menuPosX, this.menuPosY);

    this.toggleContextMenu();

    // hide all menu sections
    let sectionElements = this.contextMenu.querySelectorAll(`.${MENU_SECTION_CLASS}`);
    for (let i = 0; i < sectionElements.length; i++) {
      sectionElements[i].classList.remove(MENU_SECTION_VISIBILITY_CLASS);
    }

    // populate array with names of menu sections to be displayed
    let sections = [];
    if (this.component !== null) {
      sections.push('component');
      if (this.component instanceof Node) {
        sections.push('node');
      } else if (this.component instanceof Edge) {
        sections.push('edge');
      }
    } else {
      sections.push('default');
    }
    sections.push('action');

    // make menu sections visible
    for (let section of sections) {
      let sectionElement = this.contextMenu.querySelector(`.${MENU_SECTION_CLASS}[${MENU_SECTION_NAME_ATTRIBUTE}="${section}"]`);
      sectionElement.classList.add(MENU_SECTION_VISIBILITY_CLASS);
    }

    this.repositionMenu(event);
  }

}

export { ContextMenu };
export default ContextMenu;
