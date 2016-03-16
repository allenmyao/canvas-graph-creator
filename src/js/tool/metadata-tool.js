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

  activate() {
    this.deselect();
    this.labelBox = document.getElementById('metadata-label-text');
    this.labelBtn = document.getElementById('metadata-label-btn');
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
    if (this.target !== null) {
      if (this.target instanceof Node) {
        this.target.isSelected = false;
      } else if (this.target instanceof Edge) {
        this.target.isSelected = false;
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
    if (this.target === null)
      return;
    if (type == 'label') {
      if (this.target instanceof Node) {
        this.target.nodeLabel = this.labelBox.value;
        console.log("Editing Node Label at (" + this.target.xText + "," + this.target.yText + ")");
      } else if (this.target instanceof Edge) {
        this.target.edgeLabel = this.labelBox.value;
      }
    }
  }

  selectNode(graph, node) {
    if (node != this.target) {
      this.deselect();
      this.target = node;
      this.target.isSelected = true;
      this.labelBox.removeAttribute('disabled');
      this.labelBox.placeholder = 'Node Label';
      this.labelBox.value = node.nodeLabel;
      this.labelBtn.removeAttribute('disabled');
    }
  }

  selectEdge(graph, edge) {
    if (edge != this.target) {
      this.deselect();
      this.target = edge;
      this.target.isSelected = true;
      this.labelBox.removeAttribute('disabled');
      this.labelBox.placeholder = 'Edge Label';
      this.labelBox.value = edge.edgeLabel;
      this.labelBtn.removeAttribute('disabled');
    }
  }

  selectObject(graph, obj, x, y) {
    if (obj instanceof Node) {
      this.selectNode(graph, obj);
    } else if (obj instanceof Edge) {
      this.selectEdge(graph, obj);
    }
  }

  selectNone(graph, x, y) {
    this.deselect();
  }

}
