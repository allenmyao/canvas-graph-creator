import 'babel-polyfill';
 
import {Graph} from './graph';
import {Node} from './node';
import {Edge} from './edge';
 
var canvas;
var context;
var graph;
var stateFunction;//Holds the function that will be applied when we click on stuff
 
function init() {
 
    canvas = document.getElementById('canvas');
    // canvas.setAttribute('width', 800);
    // canvas.setAttribute('height', 600);
 
    context = canvas.getContext('2d');
    // context.imageSmoothingEnabled = true;
 
    graph = new Graph();
 
    stateFunction = function(x,y) {return nodeClick(x,y);};
 
    canvas.addEventListener('click', clickEventListener, false);
 
    window.requestAnimationFrame(draw);
}
 
function nodeClick(x,y) {//split up more functionality to the move listener
  let selectedNode = null;
  let startNode = null;
  graph.forEachNode((node) => {
      // console.log('checking node ' + node.id);
 
      if (node.containsPoint(x, y)) {
          if (node.isSelected) {
              node.isSelected = false;
          } else if (!selectedNode) {
              node.isSelected = true;
              selectedNode = node;
          }
      } else if (node.isSelected) {
          startNode = node;
      }
 
      if (selectedNode && startNode) {
          return false;
      }
  });
 
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
 
function clickEventListener(event) {
    let canvasLeft = canvas.offsetLeft;
    let canvasTop = canvas.offsetTop;
 
    let x = event.pageX - canvasLeft;
    let y = event.pageY - canvasTop;
 
    stateFunction(x,y);
}

