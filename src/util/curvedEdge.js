import { Edge } from './edge';

export const EDGE_DISTANCE_THRESHOLD = 10;
export const DEFAULT_RADIUS = 30;
let cvs = null;
let ctx = null;

export function initCurved(canvas, context) {
  cvs = canvas;
  ctx = context;
}

// cleanvs the canvas
export function resetCanvas() {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
}

// sets style. call prior to drawEdge or drawNode
// lineColor: hex string that defines color (ex: '#FF0000')
// width: width of line
export function setStyle(lineColor, width) {
  ctx.strokeStyle = '#FF0000';
  ctx.lineWidth = width;
}

// drawing function, draws edges
// edge: edge Object to be drawn
export function drawEdge(edge) {
  ctx.beginPath();
  ctx.moveTo(edge.startPoint.x, edge.startPoint.y);
  ctx.quadraticCurveTo(edge.bezierPoint.x, edge.bezierPoint.y, edge.destPoint.x, edge.destPoint.y);
  ctx.stroke();
}


// drawing function, draws nodes
// node: node Object to be drawn
export function drawNode(node) {
  ctx.beginPath();
  ctx.arc(node.x, node.y, DEFAULT_RADIUS, 0, 2 * Math.PI);
  ctx.stroke();
}

// generates generic canvas drawing data for a given number of edges between two nodes
// arguments:
// startNode: starting Node object
// endNode: ending Node object
// edgeNum: number of edges between the nodes
// type: (currently unused) specifies type of edge (directed? self-loop?)
// returns:
// an array of Edge objects
export function calculateEdges(startNode, endNode, edgeNum, type) {
  let c1x = startNode.x;
  let c1y = startNode.y;
  let c2x = endNode.x;
  let c2y = endNode.y;
  let r = DEFAULT_RADIUS;

  // auxiliary letiables for conceptual understanding
  // will be refactored if needed
  let c2xtrans = c2x - c1x;
  let c2ytrans = c2y - c1y;
  // let c1xtrans = 0;
  // let c1ytrans = 0;
  let theta = Math.asin(c2ytrans / Math.sqrt(c2xtrans * c2xtrans + c2ytrans * c2ytrans));
  // let c1xrot = 0;
  // let c1yrot = 0;
  let c2xrot = c2xtrans * Math.cos(-theta) - c2ytrans * Math.sin(-theta);
  // let c2yrot = 0;

  let edges = [];
  for (let i = 0; i < edgeNum; i++) {
    let currTheta = (Math.PI * (i + 1) / (edgeNum + 1) - Math.PI / 2);
    let edgedata = [
      r * Math.cos(currTheta),
      r * Math.sin(currTheta),
      c2xrot / 2,
      c2xrot * (2 * currTheta / Math.PI),
      c2xrot - r * Math.cos(currTheta),
      r * Math.sin(currTheta)
    ];
    // rotate and translate back
    for (let j = 0; j < 3; j++) {
      let tempX = edgedata[2 * j] * Math.cos(theta) - edgedata[2 * j + 1] * Math.sin(theta) + c1x;
      let tempY = edgedata[2 * j] * Math.sin(theta) + edgedata[2 * j + 1] * Math.cos(theta) + c1y;
      edgedata[2 * j] = tempX;
      edgedata[2 * j + 1] = tempY;
    }


    edges[edges.length] = new Edge(startNode, endNode, edgedata[0], edgedata[1], edgedata[2],
                     edgedata[3], edgedata[4], edgedata[5]);
  }
  return edges;
}

// returns the closest edge in the array to the specified point, or false if it's not within the default threshold or if the array is empty
// arguments:
// edges: an array of Edge objects to be examined
// pointX, pointY: numerical values that represent the location of the point
// returns false if edges is empty or if the edge is not within the standard threshold
export function findClosestEdge(edges, pointX, pointY) {
  if (edges.length > 0) {
    let shortestDist = cvs.width + cvs.height;
    let shortestIndex = 0;
    for (let i = 0; i < edges.length; i++) {
      // calls the helper function to find the distance
      let tempDist = calcBezierDistance(pointX, pointY, edges[i].startPoint.x, edges[i].startPoint.y, edges[i].bezierPoint.x, edges[i].bezierPoint.y, edges[i].destPoint.x, edges[i].destPoint.y);
      if (shortestDist > tempDist) {
        shortestDist = tempDist;
        shortestIndex = i;
      }
    }

    if (shortestDist < EDGE_DISTANCE_THRESHOLD) {
      return edges[shortestIndex];
    }
    return false;
    // highlight the edge
  }
  return false;
}

// the following two functions adapted from: http:// stackoverflow.com / questions / 27176423 / function-to-solve-cubic-equation-analytically
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
export function calcBezierDistance(pointX, pointY, startX, startY, controlX, controlY, endX, endY) {
  // preliminary, commonly used values
  let aX = controlX - startX;
  let aY = controlY - startY;
  let bX = endX - controlX - aX;
  let bY = endY - controlY - aY;
  let mX = startX - pointX;
  let mY = startY - pointY;

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
  let smallestDist = cvs.width + cvs.height;
  // diagnostic values
  // let smallestX;
  // let smallestY;

  // curves are parametrized as:  P(t) = (1-t)²P0 + 2t(1-t)P1 +t²P2.
  for (let j = 0; j < ans.length; j++) {
    let t = ans[j];
    let curvePointX = (1 - t) * startX * (1 - t) + 2 * t * (1 - t) * controlX + t * t * endX;
    let curvePointY = (1 - t) * startY * (1 - t) + 2 * t * (1 - t) * controlY + t * t * endY;
    let tempDist = Math.sqrt((curvePointX - pointX) * (curvePointX - pointX) + (curvePointY - pointY) * (curvePointY - pointY));
    if (smallestDist > tempDist) {
      smallestDist = tempDist;
      // smallestX = curvePointX;
      // smallestY = curvePointY;
    }
  }
  // ctx.lineWidth = 1;
  // ctx.strokeStyle='#000000';

  // diagnostic drawings
  /*
  ctx.beginPath();
  ctx.arc(smallestX, smallestY, 5, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pointX,pointY);
  ctx.lineTo(smallestX,smallestY);
  ctx.stroke();
  */

  return smallestDist;
}

export function bezierDerivative(t, startX, startY, controlX, controlY, endX, endY) {
  return {
    x: (2 * t - 2) * startX + (2 - 4 * t) * controlX + 2 * t * endX,
    y: (2 * t - 2) * startY + (2 - 4 * t) * controlY + 2 * t * endY
  };
}

export function bezierPoint(t, startX, startY, controlX, controlY, endX, endY) {
  return {
    x: (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX,
    y: (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY
  };
}

export function drawArrows(edge, start, end) {
  let slope;
  let length;
  if (start) {
    slope = bezierDerivative(0, edge.startPoint.x, edge.startPoint.y, edge.bezierPoint.x,
                  edge.bezierPoint.y, edge.destPoint.x, edge.destPoint.y);
    length = Math.sqrt(slope.x * slope.x + slope.y * slope.y);
    // normalize slope
    slope = { x: slope.x / length, y: slope.y / length };
    // perpendicular:
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(edge.startPoint.x, edge.startPoint.y);
    ctx.lineTo(edge.startPoint.x + 15 * slope.x - 5 * slope.y,
             edge.startPoint.y + 15 * slope.y + 5 * slope.x);
    ctx.lineTo(edge.startPoint.x + 9 * slope.x, edge.startPoint.y + 9 * slope.y);
    ctx.lineTo(edge.startPoint.x + 15 * slope.x + 5 * slope.y,
             edge.startPoint.y + 15 * slope.y - 5 * slope.x);
    ctx.closePath();
    ctx.fill();
  }
  if (end) {
    slope = bezierDerivative(1, edge.startPoint.x, edge.startPoint.y, edge.bezierPoint.x,
                  edge.bezierPoint.y, edge.destPoint.x, edge.destPoint.y);
    length = Math.sqrt(slope.x * slope.x + slope.y * slope.y);
    // normalize slope
    slope = { x: slope.x / length, y: slope.y / length };
    // perpendicular:
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(edge.destPoint.x, edge.destPoint.y);
    ctx.lineTo(edge.destPoint.x - 15 * slope.x - 5 * slope.y,
             edge.destPoint.y - 15 * slope.y + 5 * slope.x);
    ctx.lineTo(edge.destPoint.x - 9 * slope.x, edge.destPoint.y - 9 * slope.y);
    ctx.lineTo(edge.destPoint.x - 15 * slope.x + 5 * slope.y,
             edge.destPoint.y - 15 * slope.y - 5 * slope.x);
    ctx.fill();
  }
}

export function drawLabel(edge, label) {
  let slope = bezierDerivative(0.5, edge.startPoint.x, edge.startPoint.y, edge.bezierPoint.x,
                  edge.bezierPoint.y, edge.destPoint.x, edge.destPoint.y);
  let length = Math.sqrt(slope.x * slope.x + slope.y * slope.y);
  slope = { x: slope.x / length, y: slope.y / length };
  let point = bezierPoint(0.5, edge.startPoint.x, edge.startPoint.y, edge.bezierPoint.x,
                 edge.bezierPoint.y, edge.destPoint.x, edge.destPoint.y);
  ctx.font = '12px Arial';
  ctx.fillText(label, point.x + 12 * slope.y, point.y - 12 * slope.x);
}

export function calculateLoop(node, angle) {
  // let edge = [];
  let theta = Math.PI * angle / 180;
  let r = DEFAULT_RADIUS;
  return new Edge(node, node,
       r * Math.cos(theta) + node.x, r * Math.sin(theta) + node.y,
       4 * r * Math.cos(theta + Math.PI / 8) + node.x, 4 * r * Math.sin(theta + Math.PI / 8) + node.y,
       r * Math.cos(theta + Math.PI / 4) + node.x, r * Math.sin(theta + Math.PI / 4) + node.y);
}
