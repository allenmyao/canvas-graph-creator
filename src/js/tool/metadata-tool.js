import { Tool } from '../tool/tool';
import { Node } from '../data/node/node';
import { Edge } from '../data/edge/edge';

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
    let oldCtrl;
    let labelTxt;
    if (this.target === null) {
      return;
    }
    this.onCtrl = false;
    this.dragging = false;
    if (type === 'label') {
      if (this.target instanceof Node) {
        this.target.nodeLabel = this.labelBox.value;
        labelTxt = this.target.nodeLabel;
      } else if (this.target instanceof Edge) {
        this.target.edgeLabel = this.labelBox.value;
        labelTxt = this.target.edgeLabel;
      } else {
        return;
      }
      // console.log('Editing Label at (' + this.target.xText + ',' + this.target.yText + ')');
      oldCtrl = this.target.showTextCtrl;
      this.target.showTextCtrl = (labelTxt !== '');
      if (!oldCtrl && this.target.showTextCtrl) {
        // First time showing the label? Position it.
        this.target.generateDefaultTextLocation();
      }
    }
  }

  selectElement(elem, labelTxt, placeholder) {
    if (elem !== this.target) {
      this.deselect();
      this.target = elem;
      this.target.isSelected = true;
      elem.showTextCtrl = (labelTxt !== '');
      this.labelBox.removeAttribute('disabled');
      this.labelBox.placeholder = placeholder;
      this.labelBox.value = labelTxt;
      this.labelBtn.removeAttribute('disabled');
    }
  }

  preSelectObject(event, graph, obj, x, y) {
    return this.preSelect(event, graph, obj, x, y);
  }

  preSelectNone(event, graph, x, y) {
    this.preSelect(event, graph, null, x, y);
  }

  // Anticipate Dragging
  preSelect(event, graph, obj, x, y) {
    if (this.target !== null && this.target.showTextCtrl === true && this.onCtrl === false) {
      let xd = this.target.xText - x;
      let yd = this.target.yText - y;
      let ds = (xd * xd + yd * yd);
      if (ds < 9) {
        // console.log('Pre-Selecting Label Control Point');
        this.onCtrl = true;
        // If we're selecting the label control point, never commit to selecting underlying objects
        return false;
      }
    }
    return (obj !== null);
  }

  // Never commit to built-in dragging...
  preDragObject(event, graph, srcObj, x, y) {
    this.preDragNone(event, graph, x, y);
    return false;
  }

  // But use it as a trigger to start a custom drag.
  preDragNone(event, graph, x, y) {
    if (this.target !== null && this.target.showTextCtrl === true && this.onCtrl === true) {
      this.dragging = true;
      // console.log('Dragging Label Control Point');
    }
  }

  // All of the Mouse-Up functions need to disable our non-standard dragging.
  dropOnObject(event, graph, droppedObj, destObj, startX, startY, x, y) {
    this.abortSelect(graph, x, y);
  }

  dropOnNone(event, graph, droppedObj, startX, startY, x, y) {
    this.abortSelect(graph, x, y);
  }

  abortSelect(graph, x, y) {
    this.onCtrl = false;
    this.dragging = false;
  }

  // This tool can select both nodes and edges.
  selectObject(event, graph, obj, x, y) {
    this.onCtrl = false;
    this.dragging = false;
    if (obj instanceof Node) {
      this.selectElement(obj, obj.nodeLabel, 'Node Label');
    } else if (obj instanceof Edge) {
      this.selectElement(obj, obj.edgeLabel, 'Edge Label');
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
