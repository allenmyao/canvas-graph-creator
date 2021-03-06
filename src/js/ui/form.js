/**
 * Call to initialize form functionality.
 */
export function init() {
  initListeners();
}

function initListeners() {
  // Create MutationObserver to check for newly added inputs
  let obs = new MutationObserver((mutations, observer) => {
    for (let mutation of mutations) {
      if (mutation.addedNodes) {
        for (let element of mutation.addedNodes) {
          // Check if input was added
          if (element.tagName === 'FIELDSET') {
            let inputs = element.querySelectorAll('input, textarea');
            for (let i = 0; i < inputs.length; i++) {
              let input = inputs[i];
              if (input.value === '') {
                input.classList.add('empty');
              } else {
                input.classList.remove('empty');
              }
            }
          }
        }
      }
    }
  });

  // Observe document for element addition/removal
  obs.observe(document, {
    childList: true,
    subtree: true
  });

  document.addEventListener('change', (event) => {
    checkInputEmpty(event);
  });

  document.addEventListener('input', (event) => {
    checkInputEmpty(event);
  });

  document.addEventListener('click', (event) => {
    checkLabelClick(event);
  });
}

function checkInputEmpty(event) {
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
    let input = event.target;
    if (!input.validity.valid) {
      return;
    }
    if (input.value === '') {
      input.classList.add('empty');
    } else {
      input.classList.remove('empty');
    }
  }
}

function checkLabelClick(event) {
  if (event.target.tagName === 'LABEL') {
    let input = event.target.parentNode.querySelector('input, select, textarea');
    let type = input.type;

    if (type === 'checkbox' || type === 'radio' || type === 'color') {
      input.click();
    } else {
      input.focus();
    }
  }
}

/**
 * Get the value of the given form input.
 * @param  {Element} input - Form input DOM element.
 * @return {(boolean|number|string)} - Value of the input.
 */
export function getInputValue(input) {
  let value;
  if (input.type === 'checkbox') {
    value = input.checked;
  } else if (input.type === 'number') {
    value = parseInt(input.value, 10);
  } else {
    value = input.value;
  }
  return value;
}

/**
 * Create an html string for a form given an array of field types.
 * @param  {Array.<InputType>} fields - Array of input types.
 * @return {string} - String containing HTML for the form.
 */
export function createForm(fields) {
  let html = '';

  for (let field of fields) {
    let fieldHtml;

    let type = field.type;
    let name = field.name;
    let value = field.value;
    if (type === 'number') {
      if (value !== Math.round(value)) {
        value = value.toFixed(2);
      }
      fieldHtml = `<input type="number" name="${name}" value="${value}" step="any">`;
    } else if (type === 'boolean') {
      fieldHtml = `<input type="checkbox" name="${name}" ${value ? 'checked="true"' : ''}>`;
    } else if (type === 'string') {
      fieldHtml = `<input type="text" name="${name}" value="${value}">`;
    } else if (type === 'color') {
      fieldHtml = `<input type="color" name="${name}" value="${value}">`;
    } else {
      fieldHtml = `<output>${value}</output>`;
    }

    let displayName = field.displayName;
    html += `<fieldset>${fieldHtml}<label>${displayName}</label></fieldset>`;
  }

  return html;
}

/**
 * Create a form with inputs for graph elements. Also has options for a button to submit the form.
 * @param  {Array.<InputType>} fields - Array of input types.
 * @param  {boolean} canSubmit - Whether or not the form can be submitted.
 * @param  {string} submitText - Text to be displayed on the submit button.
 * @return {string} - String containing HTML for the form.
 */
export function createGraphForm(fields, canSubmit, submitText) {
  let html = '';

  for (let field of fields) {
    let fieldHtml;

    let type = field.type;
    let name = field.name;
    let value = field.value;
    let isRequired = field.required;
    let displayName = field.displayName;

    if (type === 'number') {
      fieldHtml = `<input type="number" name="${name}" value="${value}" step="any" ${isRequired ? 'required' : ''}><label>${displayName}</label>`;
    } else if (type === 'boolean') {
      fieldHtml = `<input type="checkbox" name="${name}" ${value ? 'checked="true"' : ''} ${isRequired ? 'required' : ''}><label>${displayName}</label>`;
    } else if (type === 'string') {
      fieldHtml = `<input type="text" name="${name}" value="${value}" ${isRequired ? 'required' : ''}><label>${displayName}</label>`;
    } else if (type === 'color') {
      fieldHtml = `<input type="color" name="${name}" value="${value}" ${isRequired ? 'required' : ''}><label>${displayName}</label>`;
    } else if (type === 'node' || type === 'edge') {
      fieldHtml = `
        <input type="hidden" name="${name}" data-type="${type}" ${value ? 'value="${value.id}"' : ''} ${isRequired ? 'required' : ''}>
        <label>${displayName}</label>
        <output name="${name}">${value ? type + value.id : '&nbsp;'}</output>
        <button type="button" class="input-select-btn btn-raised">Select</button>
      `;
    }

    html += `
      <fieldset>
        ${fieldHtml}
      </fieldset>
    `;
  }


  html += `<button type="button" class="form__submit-btn btn-raised btn-primary">${submitText}</button>`;


  return html;
}

/**
 * Get all of the data from a form.
 * @param  {Element} form - Form DOM element.
 * @param  {Graph} graph - The current graph object.
 * @return {Object.<string,*>} - Object containing input names and their associated input values
 */
export function getData(form, graph) {
  let data = {};
  let fieldsets = form.querySelectorAll('fieldset');

  for (let i = 0; i < fieldsets.length; i++) {
    let inputs = fieldsets[i].querySelectorAll('input, select, textarea');
    let fieldData = getFieldData(inputs, graph);
    for (let field of Object.keys(fieldData)) {
      data[field] = fieldData[field];
    }
  }
  return data;
}

/**
 * Add/remove the CSS class 'error' to the specified form input.
 * @param  {Element} form - Form dom element.
 * @param  {string} inputName - Name of the input.
 * @param  {boolean} showError - Whether or not the input should display an error.
 */
export function displayError(form, inputName, showError) {
  let fieldset = form.querySelector(`[name="${inputName}"]`);
  if (showError) {
    fieldset.classList.add('error');
  } else {
    fieldset.classList.remove('error');
  }
}

function getFieldData(inputs, graph) {
  let data = {};
  for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i];
    let name = input.name;
    let value;
    if (input.tagName === 'INPUT') {
      value = getInputValueLocal(input, graph);
    }
    data[name] = value;
  }
  return data;
}

/**
 * Get the value of a single input. Used when the input could contain a reference to a Node or Edge.
 * @param  {Element} input - Form input DOM element.
 * @param  {Graph} graph - Graph object.
 * @return {(boolean|number|string|Node|Edge)} - The value of the input.
 */
export function getInputValueLocal(input, graph) {
  let value;
  let type = input.getAttribute('type');
  let dataType = input.getAttribute('data-type');
  if (type === 'checkbox') {
    value = input.checked;
  } else if (type === 'number') {
    value = parseInt(input.value, 10);
  } else if (type === 'hidden' && [ 'node', 'edge' ].indexOf(dataType) >= 0) {
    let id = parseInt(input.value, 10);
    if (dataType === 'node') {
      value = getNodeById(graph, id);
    } else if (dataType === 'edge') {
      value = getEdgeById(graph, id);
    }
  } else {
    value = input.value;
  }
  return value;
}

function getNodeById(graph, id) {
  let value = null;
  graph.forEachNode((node) => {
    if (node.id === id) {
      value = node;
      return false;
    }
    return true;
  });
  return value;
}

function getEdgeById(graph, id) {
  let value = null;
  graph.forEachEdge((edge) => {
    if (edge.id === id) {
      value = edge;
      return false;
    }
    return true;
  });
  return value;
}
