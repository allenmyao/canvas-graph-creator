import { Tool } from 'tool/tool';
import { Node } from 'data/node/node';
import { Edge } from 'data/edge/edge';

export class MetadataTool extends Tool {

  name = 'Metadata Tool';

  getInputHtml() {
    let html = '<li class="tool-input"><div class="tinput">';
    html += '<input id="metadata-label-text" type="text" maxlength="32" placeholder="Object Label" disabled=""></textarea>';
    html += '<button id="metadata-label-btn" type="button" disabled="">Apply</button>';
    html += '</div></li>';
    return html;
  }

  hasInputs() {
    return true;
  }

  active = false;
  target = null;
  labelBox = null;
  labelBtn = null;
  onCtrl = false;
  dragging = false;

  activate() {
    this.deselect();
    this.labelBox = document.getElementById('metadata-label-text');
    this.labelBtn = document.getElementById('metadata-label-btn');
    this.labelBox.addEventListener('keypress', (event) => {
      let key = event.which || event.keyCode;
      if (key === 13) {
        this.apply('label');
      }
    }, false);
    this.labelBtn.addEventListener('click', (event) => {
      this.apply('label');
    }, false);
    this.active = true;
  }

  cancel() {
    this.deselect();
    this.active = false;
    this.labelBox = null;
    this.labelBtn = null;
  }

  deselect() {
    this.onCtrl = false;
    this.dragging = false;
    if (this.target !== null) {
      if (this.target instanceof Node || this.target instanceof Edge) {
        this.target.isSelected = false;
        this.target.showTextCtrl = false;
      }
      this.target = null;
    }
    if (this.active) {
      this.labelBox.setAttribute('disabled', true);
      this.labelBox.value = '';
      this.labelBox.placeholder = 'Object Label';
      this.labelBtn.setAttribute('disabled', true);
    }
  }

  apply(type) {
    if (this.target === null) {
      return;
    }
    this.onCtrl = false;
    this.dragging = false;
    if (type === 'label') {
      if (this.target instanceof Node) {
        this.target.nodeLabel = this.labelBox.value;
        let oldCtrl = this.target.showTextCtrl;
        this.target.showTextCtrl = (this.target.nodeLabel !== '');
        if (!oldCtrl && this.target.showTextCtrl) {
          // First time showing the label? Position it.
          this.target.generateDefaultTextLocation();
        }
        // console.log('Editing Node Label at (' + this.target.xText + ',' + this.target.yText + ')');
      } else if (this.target instanceof Edge) {
        this.target.edgeLabel = this.labelBox.value;
        let oldCtrl = this.target.showTextCtrl;
        this.target.showTextCtrl = (this.target.edgeLabel !== '');
        if (!oldCtrl && this.target.showTextCtrl) {
          // First time showing the label? Position it.
          this.target.generateDefaultTextLocation();
        }
        // console.log('Editing Edge Label at (' + this.target.xText + ',' + this.target.yText + ')');
      }
    }
  }

  selectNode(graph, node) {
    if (node !== this.target) {
      this.deselect();
      this.target = node;
      this.target.isSelected = true;
      node.showTextCtrl = (node.nodeLabel !== '');
      this.labelBox.removeAttribute('disabled');
      this.labelBox.placeholder = 'Node Label';
      this.labelBox.value = node.nodeLabel;
      this.labelBtn.removeAttribute('disabled');
    }
  }

  selectEdge(graph, edge) {
    if (edge !== this.target) {
      this.deselect();
      this.target = edge;
      this.target.isSelected = true;
      edge.showTextCtrl = (edge.edgeLabel !== '');
      this.labelBox.removeAttribute('disabled');
      this.labelBox.placeholder = 'Edge Label';
      this.labelBox.value = edge.edgeLabel;
      this.labelBtn.removeAttribute('disabled');
    }
  }

  preSelectObject(event, graph, obj, x, y) {
    this.preSelectNone(event, graph, x, y);
    return true;
  }

  // Anticipate Dragging
  preSelectNone(event, graph, x, y) {
    if (this.target !== null && this.target.showTextCtrl === true && this.onCtrl === false) {
      let xd = this.target.xText - x;
      let yd = this.target.yText - y;
      let ds = (xd * xd + yd * yd);
      if (ds < 9) {
        // console.log('Pre-Selecting Label Control Point');
        this.onCtrl = true;
      }
    }
  }

  preDragObject(event, graph, srcObj, x, y) {
    this.preDragNone(event, graph, x, y);
    return false;
  }

  // Start Dragging
  preDragNone(event, graph, x, y) {
    if (this.target !== null && this.target.showTextCtrl === true && this.onCtrl === true) {
      this.dragging = true;
      // console.log('Dragging Label Control Point');
    }
  }

  // All of the Mouse-Up functions need to disable our non-standard dragging.
  dropOnObject(event, graph, droppedObj, destObj, startX, startY, x, y) {
    this.abortSelect(event, graph, x, y);
  }

  dropOnNone(graph, droppedObj, startX, startY, x, y) {
    this.abortSelect(event, graph, x, y);
  }

  abortSelect(event, graph, x, y) {
    this.onCtrl = false;
    this.dragging = false;
  }

  // This tool can select both nodes and edges.
  selectObject(event, graph, obj, x, y) {
    this.onCtrl = false;
    this.dragging = false;
    if (obj instanceof Node) {
      this.selectNode(graph, obj);
    } else if (obj instanceof Edge) {
      this.selectEdge(graph, obj);
    }
  }

  selectNone(event, graph, x, y) {
    this.deselect();
  }

  // Drag the target object's label control point
  dragNone(event, graph, startX, startY, x, y) {
    if (this.target !== null && this.dragging === true) {
      this.target.xText = x;
      this.target.yText = y;
    }
  }

}
