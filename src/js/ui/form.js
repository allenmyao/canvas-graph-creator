export function getData(form) {
  let data = {};
  let inputs = form.querySelectorAll('input, select, textarea');
  for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i];
    let name = input.name;
    let value;
    if (input.tagName === 'INPUT') {
      let type = input.getAttribute('type');
      if (type === 'checkbox') {
        value = input.checked;
      } else if (type === 'number') {
        value = parseInt(input.value, 10);
      } else {
        value = input.value;
      }
    }
    data[name] = value;
  }
  return data;
}
