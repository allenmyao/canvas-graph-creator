// the following two functions adapted from:
// http://stackoverflow.com/questions/27176423/function-to-solve-cubic-equation-analytically
// calculates cube root
// self-explanatory
function cuberoot(x) {
  let y = Math.pow(Math.abs(x), 1 / 3);
  return x < 0 ? -y : y;
}

function solveLinear(a, b) {
  return [ -b / a ];
}

function solveQuadratic(a, b, c, epsilon) {
  let roots;
  let d = b * b - 4 * a * c;
  if (Math.abs(d) < epsilon) {
    roots = [ -b / (2 * a) ];
  } else if (d > 0) {
    roots = [ (-b + Math.sqrt(d)) / (2 * a), (-b - Math.sqrt(d)) / (2 * a) ];
  }
  return roots;
}

/**
 * Function to solve for x when ax^3 + bx^2 + c + d = 0/
 * @param  {number} a - Coefficient of x^3 term.
 * @param  {number} b - Coefficient of x^2 term.
 * @param  {number} c - Coefficient of x term.
 * @param  {number} d - Constant.
 * @param  {number} epsilon - Margin of error.
 * @return {Array.<number>} - An array of x-coordinates for the roots of the cubic.
 */
function solveCubic(a, b, c, d, epsilon) {
  if (Math.abs(a) < epsilon) {
    if (Math.abs(b) < epsilon) {
      // Linear case, cx + d = 0
      return solveLinear(c, d);
    }
    // Quadratic case, bx^2 + cx + d = 0
    return solveQuadratic(b, c, d, epsilon);
  }

  // Convert to depressed cubic t^3 + pt + q = 0 (subst x = t - b / 3a)
  let p = (3 * a * c - b * b) / (3 * a * a);
  let q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
  let roots;

  // https://en.wikipedia.org/wiki/Cubic_function#Cardano.27s_method
  if (Math.abs(p) < epsilon) {
    // p = 0
    // t^3 = -q
    // t = -q^1 / 3
    roots = [ cuberoot(-q) ];
  } else if (Math.abs(q) < epsilon) {
    // q = 0
    // t^3 + pt = 0
    // t(t^2 + p) = 0
    roots = [ 0 ].concat(p < 0 ? [ Math.sqrt(-p), -Math.sqrt(-p) ] : []);
  } else {
    let e = q * q / 4 + p * p * p / 27;
    if (Math.abs(e) < epsilon) {
      // e = 0 -> two roots
      roots = [ -1.5 * q / p, 3 * q / p ];
    } else if (e > 0) {
      // Only one real root
      let u = cuberoot(-q / 2 - Math.sqrt(e));
      roots = [ u - p / (3 * u) ];
    } else {
      // e < 0, three roots, but needs to use complex numbers / trigonometric solution
      let u = 2 * Math.sqrt(-p / 3);
      // e < 0 implies p < 0 and acos argument in [-1..1]
      let t = Math.acos(3 * q / p / u) / 3;
      let k = 2 * Math.PI / 3;
      roots = [ u * Math.cos(t), u * Math.cos(t - k), u * Math.cos(t - 2 * k) ];
    }
  }

  // Convert back from depressed cubic
  for (let i = 0; i < roots.length; i++) {
    roots[i] -= b / (3 * a);
  }

  return roots;
}


/**
 * @typedef Point
 * @type {object}
 * @property {number} x - Number representing x-coordinate.
 * @property {number} y - Number representing y-coordinate.
 */

/**
 * Function that calculates the distance between a specified point and a quadratic bezier.
 * @param  {number} pointX - x-coordinate of the specified point.
 * @param  {number} pointY - y-coordinate of the specified point.
 * @param  {Point} start - The start point of the bezier curve.
 * @param  {Point} control - The control point of the bezier curve.
 * @param  {Point} end - The end point of the bezier curve.
 * @return {number} - The distance between (pointX, pointY) and the bezier curve specified by start, control, and end.
 */
export function calcBezierDistance(pointX, pointY, start, control, end) {
  // Quadratic bezier curves are parametrized as:
  // P(t) = (1-t)^2 * P0 + 2 * t * (1-t) * C + t^2 * P1
  //        for 0 <= t <= 1
  //        where P(0) = P0, P(1) = P1, and C is the control point.
  //
  // P(t)     = (1-t)^2 * P0          +   2 * t * (1-t) * C   +   t^2 * P1
  //          = (t^2 - 2t + 1) * P0   +   2 * (t - t^2) * C   +   t^2 * P1
  // dP/dt(t) = (2t - 2) * P0         +   2 * (1 - 2t) * C    +   2t * P1
  //          = (2t - 2) * P0         +   2 * (1 - 2t) * C    +   2t * P1
  //          = 2t * P0 - 2 * P0      +   2 * C - 4t * C      +   2t * P1
  //          = 2 * C - 2 * P0 + 2t * P0 - 4t * C + 2t * P1
  //          = 2 * (C - P0) + 2t * (P0 - 2 * C + P1)
  //          = 2 * (C - P0 + t * (P0 - 2C + P1))
  //          = 2 * (C - P0 + t * (P1 - C - (C - P0)))
  //          = 2 * (A + t * (P1 - C - A)) where A = C - P0
  //          = 2 * (A + B * t)
  //            where A = (C - P0) and B = (P1 - C - A)
  //
  let aX = control.x - start.x;
  let aY = control.y - start.y;
  let bX = end.x - control.x - aX;
  let bY = end.y - control.y - aY;

  // The closest point to M = (pointX, pointY) on the bezier curve will be
  // when the dot product of MP (vector from M to the curve P) and dP/dt
  // equals 0.
  //
  // MP = M - P
  //    = M - (1-t)^2 * P0 + 2 * t * (1-t) * C + t^2 * P1
  //
  // The equation we need to solve becomes:
  // MP . dP/dt = 0
  // (M - (1-t)^2 * P0 + 2 * t * (1-t) * C + t^2 * P1) . dP/dt = 0
  //
  // This results in the cubic equation ax^3 + bx^2 + cx + d = 0
  // where:
  //   a = B^2
  //   b = 3A . B
  //   c = 2A^2 + M' . B
  //   d = M' . A
  //   M' = P0 - M
  //
  let mX = start.x - pointX;
  let mY = start.y - pointY;

  let a = bX * bX + bY * bY;
  let b = 3 * (aX * bX + aY * bY);
  let c = 2 * (aX * aX + aY * aY) + mX * bX + mY * bY;
  let d = mX * aX + mY * aY;

  // get the roots of the derivative
  let roots = solveCubic(a, b, c, d, 1e-8);

  // reject any roots that are not on the curve P(t) where 0 <= t <= 1
  let validRoots = roots.filter((t) => t > 0 && t < 1);

  // add the endpoints of the curve
  validRoots.push(0);
  validRoots.push(1);

  // find root of derivative with minmal distance to (pointX, pointY)
  let smallestDist = Infinity;
  for (let t of validRoots) {
    let curvePointX = (1 - t) * (1 - t) * start.x + 2 * t * (1 - t) * control.x + t * t * end.x;
    let curvePointY = (1 - t) * (1 - t) * start.y + 2 * t * (1 - t) * control.y + t * t * end.y;
    let distance = Math.sqrt((curvePointX - pointX) * (curvePointX - pointX) + (curvePointY - pointY) * (curvePointY - pointY));
    if (smallestDist > distance) {
      smallestDist = distance;
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
