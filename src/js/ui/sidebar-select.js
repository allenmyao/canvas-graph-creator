import SidebarContent from '../ui/sidebar-content';
import Node from '../data/node/node';
import Edge from '../data/edge/edge';
import * as Form from '../ui/form';

/**
 * Sidebar content class for handling selected items. This sidebar is used by the SelectTool.
 * @class SidebarSelect
 */
class SidebarSelect extends SidebarContent {

  /**
   * The current selected object.
   * @type {(Node|Edge)}
   */
  selectedObject = null;

  /**
   * Constructs a SidebarSelect instance.
   * @param  {Graph} graph - The current Graph object.
   * @constructs SidebarSelect
   */
  constructor(graph) {
    super(graph);
  }

  /**
   * Called to initially display the sidebar. Also adds event listeners to the forms.
   * @override
   */
  display() {
    this.tabs.replaceTabs({
      data: 'Data',
      label: 'Label'
    });

    this.tabs.setTabContent('data', '<form></form>');
    this.tabs.setTabContent('label', '<form></form>');
    this.tabs.hideTab('label');

    this.update();
    this.tabs.selectTab('data');

    let forms = document.getElementById('sidebar').querySelectorAll('form');

    for (let i = 0; i < forms.length; i++) {
      let form = forms[i];
      form.addEventListener('input', (event) => {
        this.updateObjectValues(event);
      });

      form.addEventListener('change', (event) => {
        this.updateObjectValues(event);
      });
    }
  }

  /**
   * Update the sidebar with the selected object.
   * @param  {Node|Edge} obj - The selected Node or Edge.
   * @override
   */
  update(obj) {
    let html;
    if (obj instanceof Node) {
      html = this.displayNode(obj);
      this.selectedObject = obj;
      this.tabs.showTab('label');
    } else if (obj instanceof Edge) {
      html = this.displayEdge(obj);
      this.selectedObject = obj;
      this.tabs.showTab('label');
    } else {
      html = this.displayGraph(this.graph);
      this.selectedObject = null;
      this.tabs.hideTab('label');
      this.tabs.selectTab('data');
    }
    this.tabs.getTabContentElement('data').querySelector('form').innerHTML = html;
    if (obj instanceof Node || obj instanceof Edge) {
      this.tabs.getTabContentElement('label').querySelector('form').innerHTML = this.displayLabel(obj.label);
    }
  }

  /**
   * Called when an 'input' or 'change' event is triggered by a form input. The field associated with that input is updated with the new value of the input.
   * @param  {Event} event - Event object from the listener.
   */
  updateObjectValues(event) {
    if (this.tabs.getTabContentElement('data').contains(event.target)) {
      let input = event.target;
      let name = input.name;
      let value = Form.getInputValue(input);
      this.selectedObject[name] = value;
      if (this.selectedObject instanceof Node) {
        for (let edge of this.selectedObject.edges) {
          edge.updateEndpoints();
        }
      }
    } else if (this.tabs.getTabContentElement('label').contains(event.target)) {
      let input = event.target;
      let name = input.name;
      let value = Form.getInputValue(input);
      this.selectedObject.label[name] = value;
    }
  }

  /**
   * Get HTML for displaying Graph data. This will be used when nothing is selected.
   * @param  {Graph} graph - The Graph to display data for.
   * @return {string} - HTML string to set as the sidebar content.
   */
  displayGraph(graph) {
    return Form.createForm([
      {
        type: 'size',
        value: graph.nodes.size,
        displayName: 'Nodes'
      },
      {
        type: 'size',
        value: graph.edges.size,
        displayName: 'Edges'
      }
    ]);
  }

  /**
   * Get HTML for displaying a form for editing Node fields.
   * @param  {Node} node - The Node object to display.
   * @return {string} - HTML string of a form with inputs for the Node's fields.
   */
  displayNode(node) {
    return Form.createForm([
      {
        type: 'number',
        name: 'x',
        value: node.x,
        displayName: 'x'
      },
      {
        type: 'number',
        name: 'y',
        value: node.y,
        displayName: 'y'
      },
      {
        type: 'boolean',
        name: 'isAcceptingState',
        value: node.isAcceptingState,
        displayName: 'Accepting State'
      },
      {
        type: 'boolean',
        name: 'isStartingState',
        value: node.isStartingState,
        displayName: 'Starting State'
      },
      {
        type: 'number',
        name: 'radius',
        value: node.radius,
        displayName: 'Radius'
      },
      {
        type: 'color',
        name: 'color',
        value: node.color,
        displayName: 'Line Color'
      },
      {
        type: 'color',
        name: 'fillColor',
        value: node.fillColor,
        displayName: 'Fill Color'
      },
      {
        type: 'number',
        name: 'lineWidth',
        value: node.lineWidth,
        displayName: 'Line Width'
      }
    ]);
  }

  /**
   * Get HTML for displaying a form for editing Edge fields.
   * @param  {Edge} edge - The Edge object to display.
   * @return {string} - HTML string of a form with inputs for the Edge's fields.
   */
  displayEdge(edge) {
    return Form.createForm([
      {
        type: 'boolean',
        name: 'isDirected',
        value: edge.isDirected,
        displayName: 'Directed'
      },
      {
        type: 'color',
        name: 'color',
        value: edge.color,
        displayName: 'Color'
      },
      {
        type: 'number',
        name: 'lineWidth',
        value: edge.lineWidth,
        displayName: 'Width'
      }
    ]);
  }

  /**
   * Get HTML for displaying a form for editing Label fields.
   * @param  {Label} label - The Label object to display.
   * @return {string} - HTML string of a form with inputs for the Label's fields.
   */
  displayLabel(label) {
    return Form.createForm([
      {
        type: 'number',
        name: 'x',
        value: label.x,
        displayName: 'x'
      },
      {
        type: 'number',
        name: 'y',
        value: label.y,
        displayName: 'y'
      },
      {
        type: 'string',
        name: 'content',
        value: label.content,
        displayName: 'Label'
      },
      {
        type: 'string',
        name: 'fontSize',
        value: label.fontSize,
        displayName: 'Font size'
      },
      {
        type: 'string',
        name: 'fontFamily',
        value: label.fontFamily,
        displayName: 'Font family'
      },
      {
        type: 'color',
        name: 'color',
        value: label.color,
        displayName: 'Color'
      }
    ]);
  }
}

export { SidebarSelect };
export default SidebarSelect;
