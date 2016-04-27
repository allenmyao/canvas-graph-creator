// based on scrollToY from http://stackoverflow.com/a/16136789/1418962
function scrollToElement(element, to, speed, easing = 'easeOutSine') {
  let start = element.scrollTop;
  let diff = to - start;
  let currentTime = 0;

  // min time .1, max time .8 seconds
  let time = Math.max(0.1, Math.min(Math.abs(diff) / speed, 0.8));

  // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
  let easingEquations = {
    easeOutSine: function (pos) {
      return Math.sin(pos * (Math.PI / 2));
    },
    easeInOutSine: function (pos) {
      return (-0.5 * (Math.cos(Math.PI * pos) - 1));
    },
    easeInOutQuint: function (oldPos) {
      let pos = oldPos * 2;
      if (pos < 1) {
        return 0.5 * Math.pow(pos, 5);
      }
      return 0.5 * (Math.pow((pos - 2), 5) + 2);
    }
  };

  // add animation loop
  function tick() {
    currentTime += 1 / 60;

    let p = currentTime / time;
    let t = easingEquations[easing](p);

    if (p < 1) {
      window.requestAnimationFrame(tick);
      element.scrollTop = start + (diff * t);
    } else {
      element.scrollTop = to;
    }
  }

  // call it once to get started
  tick();
}

export { scrollToElement };
export default scrollToElement;
