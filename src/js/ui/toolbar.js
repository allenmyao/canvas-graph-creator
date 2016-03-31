import { NodeTool } from 'tool/node-tool';
import { EdgeTool } from 'tool/edge-tool';
import { MoveTool } from 'tool/move-tool';
import { EraseTool } from 'tool/erase-tool';
import { EditNodeTool } from 'tool/editnode-tool';
import { EditEdgeTool } from 'tool/editedge-tool';
import { MetadataTool } from 'tool/metadata-tool';
import { PanTool } from 'tool/pan-tool';
import { SelectTool } from 'tool/select-tool';
import { AlgorithmTool } from 'tool/algorithm-tool';
import * as Sidebar from 'ui/sidebar';

// const TOOL_CLASS = 'tool';
// const TOOL_NAME_ATTR = 'data-tool';
// const TOOL_MODE_CLASS = 'mode';
// const TOOL_MODE_NAME_ATTR = 'data-mode';

let toolbar;
let toolMap = {
  node: new NodeTool(),
  edge: new EdgeTool(),
  move: new MoveTool(),
  erase: new EraseTool(),
  editnode: new EditNodeTool(),
  editedge: new EditEdgeTool(),
  select: new SelectTool(),
  metadata: new MetadataTool(),
  pan: new PanTool(),
  algorithm: new AlgorithmTool()
};
let currentTool = toolMap.node;

export function init() {
  toolbar = document.getElementById('toolbar');

  toolbar.addEventListener('click', (event) => {
    if (event.target.classList.contains('tool')) {
      currentTool.cancel();

      let toolName = event.target.getAttribute('data-tool');
      currentTool = toolMap[toolName];
      Sidebar.changeSidebar(currentTool.sidebarType);

      selectItem('tool', event.target);

      showModes();
      currentTool.activate();
    }
  });

  showModes();

  // add event listener for mode clicks
  document.getElementById('tool-modes').addEventListener('click', (event) => {
    if (event.target.classList.contains('mode')) {
      currentTool.changeMode(event.target.getAttribute('data-mode'));
      selectItem('mode', event.target);
    }
  });
}

export function getCurrentTool() {
  return currentTool;
}

function selectItem(className, selectedElement) {
  let elements = document.getElementsByClassName(className);
  for (let i = 0; i < elements.length; i++) {
    if (elements[i] === selectedElement) {
      elements[i].classList.add('selected');
    } else {
      elements[i].classList.remove('selected');
    }
  }
}

function showModes() {
  let modeList = document.getElementById('tool-modes');
  if (currentTool.hasModes()) {
    // populate modes list
    let html = '';
    for (let mode of Object.keys(currentTool.constructor.modes)) {
      let selected = mode === currentTool.currentMode ? ' selected' : '';
      html += `<li class="tool-mode"><div class="mode vcenter-wrapper${selected}" data-mode="${mode}"><span class="vcenter">${mode}</span></div></li>`;
    }

    modeList.innerHTML = `<ul class="tool-mode-list">${html}</ul>`;
  } else {
    // clear the modes
    modeList.innerHTML = '';
  }

  let inputList = document.getElementById('tool-inputs');
  if (currentTool.hasInputs()) {
    // populate inputs list
    let html = currentTool.getInputHtml();
    modeList.innerHTML = `<ul class="tool-input-list">${html}</ul>`;
  } else {
    // clear the inputs
    inputList.innerHTML = '';
  }
}
