// the following two functions adapted from:
// http://stackoverflow.com/questions/27176423/function-to-solve-cubic-equation-analytically
// calculates cube root
// self-explanatory
function cuberoot(x) {
  let y = Math.pow(Math.abs(x), 1 / 3);
  return x < 0 ? -y : y;
}

function solveCubic(_a, _b, _c, _d) {
  let a = _a;
  let b = _b;
  let c = _c;
  let d = _d;

  if (Math.abs(a) < 1e-8) { // Quadratic case, ax^2 + bx + c=0
    a = b; b = c; c = d;
    if (Math.abs(a) < 1e-8) { // Linear case, ax + b=0
      a = b; b = c;
      if (Math.abs(a) < 1e-8) {// Degenerate case
        return [];
      }
      return [ -b / a ];
    }

    let D = b * b - 4 * a * c;
    if (Math.abs(D) < 1e-8) {
      return [ -b / (2 * a) ];
    } else if (D > 0) {
      return [ (-b + Math.sqrt(D)) / (2 * a), (-b - Math.sqrt(D)) / (2 * a) ];
    }
    return [];
  }

  // Convert to depressed cubic t^3 + pt + q = 0 (subst x = t - b / 3a)
  let p = (3 * a * c - b * b) / (3 * a * a);
  let q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
  let roots;

  if (Math.abs(p) < 1e-8) { // p = 0 -> t^3 = -q -> t = -q^1 / 3
    roots = [ cuberoot(-q) ];
  } else if (Math.abs(q) < 1e-8) { // q = 0 -> t^3 + pt = 0 -> t(t^2 + p)=0
    roots = [ 0 ].concat(p < 0 ? [ Math.sqrt(-p), -Math.sqrt(-p) ] : []);
  } else {
    let D = q * q / 4 + p * p * p / 27;
    if (Math.abs(D) < 1e-8) {       // D = 0 -> two roots
      roots = [
        -1.5 * q / p,
        3 * q / p
      ];
    } else if (D > 0) {             // Only one real root
      let u = cuberoot(-q / 2 - Math.sqrt(D));
      roots = [ u - p / (3 * u) ];
    } else {                        // D < 0, three roots, but needs to use complex numbers / trigonometric solution
      let u = 2 * Math.sqrt(-p / 3);
      let t = Math.acos(3 * q / p / u) / 3;  // D < 0 implies p < 0 and acos argument in [-1..1]
      let k = 2 * Math.PI / 3;
      roots = [
        u * Math.cos(t),
        u * Math.cos(t - k),
        u * Math.cos(t - 2 * k)
      ];
    }
  }

  // Convert back from depressed cubic
  for (let i = 0; i < roots.length; i++) {
    roots[i] -= b / (3 * a);
  }

  return roots;
}


// helper function that calculates the distance between a specified point and a quadratic bezier
export function calcBezierDistance(pointX, pointY, start, control, end) {
  // preliminary, commonly used values
  let aX = control.x - start.x;
  let aY = control.y - start.y;
  let bX = end.x - control.x - aX;
  let bY = end.y - control.y - aY;
  let mX = start.x - pointX;
  let mY = start.y - pointY;

  // coefficients for the cubic to be solved
  let a = bX * bX + bY * bY;
  let b = 3 * (aX * bX + aY * bY);
  let c = 2 * (aX * aX + aY * aY) + mX * bX + mY * bY;
  let d = mX * aX + mY * aY;
  let ans = solveCubic(a, b, c, d);

  // reject any that violates x = [0, 1]
  for (let i = ans.length - 1; i >= 0; i--) {
    if (ans[i] > 1 || ans[i] < 0) {
      ans.splice(i, 1);
    }
  }
  ans[ans.length] = 0;
  ans[ans.length] = 1; // edge cases

  // minimize dist
  let smallestDist = Infinity;

  // curves are parametrized as:  P(t) = (1-t)²P0 + 2t(1-t)P1 +t²P2.
  for (let j = 0; j < ans.length; j++) {
    let t = ans[j];
    let curvePointX = (1 - t) * start.x * (1 - t) + 2 * t * (1 - t) * control.x + t * t * end.x;
    let curvePointY = (1 - t) * start.y * (1 - t) + 2 * t * (1 - t) * control.y + t * t * end.y;
    let tempDist = Math.sqrt((curvePointX - pointX) * (curvePointX - pointX) + (curvePointY - pointY) * (curvePointY - pointY));
    if (smallestDist > tempDist) {
      smallestDist = tempDist;
      // smallestX = curvePointX;
      // smallestY = curvePointY;
    }
  }

  return smallestDist;
}

export function bezierDerivative(t, start, control, end) {
  return {
    x: (2 * t - 2) * start.x + (2 - 4 * t) * control.x + 2 * t * end.x,
    y: (2 * t - 2) * start.y + (2 - 4 * t) * control.y + 2 * t * end.y
  };
}
