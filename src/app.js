import 'babel-polyfill';
 
import {Graph} from './graph';
import {Node} from './node';
import {Edge} from './edge';
 
var canvas;
var context;
var graph;

var tempTarget;     // Initial mouse-press target. Tools may care if the mouse remains on it upon unpress.
var mouseDown;      // Is the mouse being held?
var stateFuncDown;  // The function that will be applied when we click
var stateFuncUp;    // The function that will be applied when we unclick
var stateFuncMove;  // The function that will be applied when we move the mouse
 
function init() {
 
    canvas = document.getElementById('canvas');
    // canvas.setAttribute('width', 800);
    // canvas.setAttribute('height', 600);
 
    context = canvas.getContext('2d');
    // context.imageSmoothingEnabled = true;
 
    graph = new Graph();

    tempTarget = null;
    mouseDown = false;
    stateFuncDown = function(x,y) {tempTarget = mouseSelect(x,y);};
    stateFuncUp = function(x,y) {nodeClick(x,y); tempTarget = null;};
    stateFuncMove = function(x,y) {};
 
    canvas.addEventListener('mousedown', downEventListener, false);
    canvas.addEventListener('mouseup', upEventListener, false);
    canvas.addEventListener('mousemove', moveEventListener, false);


    window.requestAnimationFrame(draw);
}

function mouseSelect(x,y) {
  let selectedNode = null;
  graph.forEachNode((node) => {
    if (node.containsPoint(x, y)) {
      selectedNode = node;
      return false;
    }
  });
  return selectedNode;
}

function nodeClick(x,y) {//split up more functionality to the move listener
  let selectedNode = null;
  let startNode = null;
  graph.forEachNode((node) => {
      // console.log('checking node ' + node.id);
 
      if (node.containsPoint(x, y)) {
          if (node.isSelected || !selectedNode) {
              selectedNode = node;
          }
      } else if (node.isSelected) {
          startNode = node;
      }
 
      if (selectedNode && startNode) {
          return false;
      }
  });

  // If the mouse has drifted to a different object, cancel.
  if (selectedNode != tempTarget) {
    console.log('Mouse Drift');
    return;
  }

  // Are we selecting or deselecting?
  if (selectedNode) {
    if (!selectedNode.isSelected) {
      selectedNode.isSelected = true;
    } else {
      selectedNode.isSelected = false;
    }
  }
 
  if (selectedNode && startNode) {
      // check if edge already exists
      if (graph.hasEdge(startNode, selectedNode)) {
          console.log('Edge already exists');
 
          selectedNode.isSelected = false;
          // startNode.isSelected = false;
          return;
      }
 
      let edge = new Edge(startNode, selectedNode);
      graph.addEdge(edge);
 
      startNode.isSelected = false;
      selectedNode.isSelected = false;
  } else if (!selectedNode) {
      let isTooClose = false;
      graph.forEachNode((node) => {
          if (node.distanceToPoint(x, y) < 2 * Node.radius + 10) {
              console.log('Too close to node ' + node.id);
              isTooClose = true;
              return false;
          }
      });
 
      if (!isTooClose) {
          let node = new Node(x, y);
          graph.addNode(node);
      }
  }
}
 
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    graph.draw(context);
    window.requestAnimationFrame(draw);
}
 
window.addEventListener('load', init, false);

function downEventListener(event) {
    mouseDown = true;
    let canvasLeft = canvas.offsetLeft;
    let canvasTop = canvas.offsetTop;

    let x = event.pageX - canvasLeft;
    let y = event.pageY - canvasTop;

    stateFuncDown(x,y);
}

function upEventListener(event) {
    mouseDown = false;
    let canvasLeft = canvas.offsetLeft;
    let canvasTop = canvas.offsetTop;

    let x = event.pageX - canvasLeft;
    let y = event.pageY - canvasTop;

    stateFuncUp(x,y);
}

function moveEventListener(event) {
    let canvasLeft = canvas.offsetLeft;
    let canvasTop = canvas.offsetTop;
 
    let x = event.pageX - canvasLeft;
    let y = event.pageY - canvasTop;
 
    stateFuncMove(x,y);
}

