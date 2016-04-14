import { Node } from 'data/node/node';
import { Edge } from 'data/edge/edge';

class ContextMenu {

  ui;

  mouseHandler;

  contextMenu;

  menuState = 0;
  menuPosX;
  menuPosY;
  component;
  taskArg = {
    'Add Circle Node': 'circle',
    'Add Square Node': 'square',
    'Toggle Accepting State': 'isAcceptingState',
    'Toggle Start State': 'isStartingState',
    'Toggle Directed Edge': 'isDirected',
    'Delete Node': 'node',
    'Delete Edge': 'edge'
  };

  constructor(ui, mouseHandler) {
    this.ui = ui;
    this.mouseHandler = mouseHandler;
    this.contextMenu = document.getElementById('context-menu');
    this.initListeners();
  }

  initListeners() {
    this.contextMenu.addEventListener('mouseup', (event) => {
      let task = event.srcElement.innerText;
      let type = task.split(' ')[0];

      if (type === 'Add') {
        this.mouseHandler.contextAdd(this.taskArg[task], this.menuPosX, this.menuPosY);
      } else if (type === 'Toggle') {
        this.mouseHandler.contextToggle(this.taskArg[task], this.component);
      } else if (type === 'Delete') {
        this.mouseHandler.contextDelete(this.taskArg[task], this.component);
      } else if (type === 'Edit') {
        this.ui.toolbar.selectToolByName('metadata');
        this.mouseHandler.contextSelect(event, this.ui.toolbar.currentTool, this.component, this.menuPosX, this.menuPosY);
      }

      this.toggleContextMenu();
    }, false);
  }

  classDisplayChange(className, displayType) {
    let items = this.contextMenu.getElementsByClassName(className);
    for (let i = 0; i < items.length; ++i) {
      items[i].style.display = displayType;
    }
  }

  toggleContextMenu() {
    if (this.menuState !== 1) {
      this.contextMenu.style.display = 'block';
      this.menuState = 1;
    } else {
      this.menuState = 0;
      this.contextMenu.style.display = 'none';
      this.classDisplayChange('component', 'none');
      this.classDisplayChange('component-node', 'none');
      this.classDisplayChange('component-edge', 'none');
      this.classDisplayChange('blank', 'none');
    }
  }

  repositionMenu(event) {
    let xpos = event.pageX;
    let ypos = event.pageY;

    document.getElementById('context-menu').style.left = xpos + 'px';
    document.getElementById('context-menu').style.top = ypos + 'px';
  }

  contextmenuEventListener(event, x, y) {
    // prevent default context menu
    event.preventDefault();

    this.menuPosX = x;
    this.menuPosY = y;

    this.component = this.mouseHandler.contextComponent(event, this.menuPosX, this.menuPosY);

    this.toggleContextMenu();

    this.repositionMenu(event);

    if (this.component !== null) {
      this.classDisplayChange('component', 'block');
      if (this.component instanceof Node) {
        this.classDisplayChange('component-node', 'block');
      } else if (this.component instanceof Edge) {
        this.classDisplayChange('component-edge', 'block');
      }
    } else {
      this.classDisplayChange('blank', 'block');
    }
  }

}

export { ContextMenu };
export default ContextMenu;
