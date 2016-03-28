export function getData(form, graph) {
  let data = {};
  let inputs = form.querySelectorAll('input, select, textarea');
  for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i];
    let name = input.name;
    let value;
    if (input.tagName === 'INPUT') {
      let type = input.getAttribute('type');
      let dataType = input.getAttribute('data-type');
      if (type === 'checkbox') {
        value = input.checked;
      } else if (type === 'number') {
        value = parseInt(input.value, 10);
      } else if (type === 'hidden' && [ 'node', 'edge' ].indexOf(dataType) >= 0) {
        let id = parseInt(input.value, 10);
        if (dataType === 'node') {
          graph.forEachNode((node) => {
            if (node.id === id) {
              value = node;
              return false;
            }
          });

          if (!value) {
            throw Error(`No node has ID: ${id}`);
          }
        } else if (dataType === 'edge') {
          graph.forEachEdge((edge) => {
            if (edge.id === id) {
              value = edge;
              return false;
            }
          });

          if (!value) {
            throw Error(`No node has ID: ${id}`);
          }
        }
      } else {
        value = input.value;
      }
    }
    data[name] = value;
  }
  return data;
}
