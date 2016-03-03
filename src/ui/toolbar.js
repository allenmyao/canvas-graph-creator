import { NodeTool } from 'node-tool';
import { EdgeTool } from 'edge-tool';
import { MoveTool } from 'move-tool';

// const TOOL_CLASS = 'tool';
// const TOOL_NAME_ATTR = 'data-tool';
// const TOOL_MODE_CLASS = 'mode';
// const TOOL_MODE_NAME_ATTR = 'data-mode';

let toolbar;
let toolMap = {
    'node': new NodeTool(),
    'edge': new EdgeTool(),
    'move': new MoveTool()
};
let currentTool = toolMap.node;

function init() {
    toolbar = document.getElementById('toolbar');

    toolbar.addEventListener('click', (event) => {
        if (event.target.classList.contains('tool')) {
            // currentTool.cancel();

            let toolName = event.target.getAttribute('data-tool');
            currentTool = toolMap[toolName];

            selectItem('tool');

            showModes();
        }
    });

    showModes();

    // add event listener for mode clicks
    document.getElementById('tool-modes').addEventListener('click', (event) => {
        if (event.target.classList.contains('mode')) {
            currentTool.currentMode = event.target.getAttribute('data-mode');
            selectItem('mode');
        }
    });
}

function getCurrentTool() {
    return currentTool;
}

function selectItem(className) {
    let elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
        if (elements[i] === event.target) {
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
}

export { init, getCurrentTool };
