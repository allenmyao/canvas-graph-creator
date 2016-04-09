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

export function displayError(form, field, showError) {
  let fieldset = form.querySelectorAll(`fieldset[name="${field}"]`);
  if (showError) {
    fieldset[0].classList.add('error');
  } else {
    fieldset[0].classList.remove('error');
  }
}

function getFieldData(inputs, graph) {
  let data = {};
  for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i];
    let name = input.name;
    let value;
    if (input.tagName === 'INPUT') {
      value = getInputValue(input, graph);
    }
    data[name] = value;
  }
  return data;
}

function getInputValue(input, graph) {
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
  });
  return value;
}
