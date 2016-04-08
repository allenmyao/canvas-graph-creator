const nodeserialize = require('node-serialize');
import { Graph } from '../data/graph';
import { Node } from '../data/node/node';
import { Edge } from '../data/edge/edge';
import { CircleNode } from '../data/node/circle-node';
import { SquareNode } from '../data/node/square-node';
import { SolidEdge } from '../data/edge/solid-edge';
import { DashedEdge } from '../data/edge/dashed-edge';

let FUNCFLAG = '_$$ND_FUNC$$_';
let KEYPATHSEPARATOR = '_$$.$$_';
let ISNATIVEFUNC = /^function\s*[^(]*\(.*\)\s*\{\s*\[native code\]\s*\}$/;

export class Serializer {

  constructor(graph, resetFn) {
    this.currentGraph = graph;
    this.resetFn = resetFn;
    this.exportBtn = document.getElementById('export-graph-button');
    this.exportBtn.addEventListener('click', (event) => {
      this.exportGraph();
    });
    this.importBtn = document.getElementById('import-graph-button');
    this.textBox = document.getElementById('export-import-text');
    this.importBtn.addEventListener('click', (event) => {
      this.importGraph();
    });
  }

  exportElement(elem, cache, path) {
    let funcStr;
    let outputObj = {};
    let key;
    let modKey;
    let setElem;
    let outElem;
    cache[path] = elem;

    if (elem instanceof Node) {
      console.log('Node at ' + path);
      if (elem instanceof CircleNode) {
        outputObj.$$TYPE$$ = 'CircleNode';
      } else if (elem instanceof SquareNode) {
        outputObj.$$TYPE$$ = 'SquareNode';
      } else {
        outputObj.$$TYPE$$ = 'Node';
      }
    } else if (elem instanceof Edge) {
      console.log('Edge at ' + path);
      if (elem instanceof SolidEdge) {
        outputObj.$$TYPE$$ = 'SolidEdge';
      } else if (elem instanceof DashedEdge) {
        outputObj.$$TYPE$$ = 'DashedEdge';
      } else {
        outputObj.$$TYPE$$ = 'Edge';
      }
    }

    for (key in elem) {
      if (elem.hasOwnProperty(key)) {
        if (typeof elem[key] === 'object' && elem[key] !== null) {
          if (elem[key] instanceof Node) {
            console.log('Node Field Detected');
            outputObj['_$$NODE$$_' + key] = elem[key].id;
          } else if (elem[key] instanceof Edge) {
            console.log('Edge Field Detected');
            outputObj['_$$EDGE$$_' + key] = elem[key].id;
          } else if (elem[key] instanceof Set) {
            modKey = '_$$SET$$_' + key;
            outputObj[modKey] = [];
            for (setElem of elem[key]) {
              if (setElem instanceof Node) {
                console.log('Node Set Field Detected with id ' + setElem.id);
                outElem = '_$$NODE$$_' + setElem.id.toString();
              } else if (setElem instanceof Edge) {
                console.log('Edge Set Field Detected with id ' + setElem.id);
                outElem = '_$$EDGE$$_' + setElem.id.toString();
                console.log('Edge Set Field Complete');
              } else {
                outElem = nodeserialize.serialize(setElem, false, outElem, cache, path + KEYPATHSEPARATOR + key + KEYPATHSEPARATOR + outputObj[key].length.toString());
              }
              outputObj[modKey].push(outElem);
            }
          } else {
            outputObj[key] = nodeserialize.serialize(elem[key], false, outputObj[key], cache, path + KEYPATHSEPARATOR + key);
          }
        } else if (typeof elem[key] === 'function') {
          funcStr = elem[key].toString();
          if (ISNATIVEFUNC.test(funcStr)) {
            throw new Error('Can\'t serialize a object with a native function property.');
          }
          outputObj[key] = FUNCFLAG + funcStr;
        } else {
          outputObj[key] = elem[key];
        }
      }
    }
    return outputObj;
  }

  exportGraph() {
    let funcStr;
    let cache = {};
    let path = '$';
    let outputObj = {};
    let key;
    let setElem;
    let outElem;
    cache[path] = this.currentGraph;

    console.log('Serial Node: ' + nodeserialize.serialize(this.currentGraph.nodes.values().next().value));

    for (key in this.currentGraph) {
      if (this.currentGraph.hasOwnProperty(key)) {
        if (typeof this.currentGraph[key] === 'object' && this.currentGraph[key] !== null) {
          if (this.currentGraph[key] instanceof Set && (key === 'edges' || key === 'nodes')) {
            console.log('Known Set Detected with size ' + this.currentGraph[key].size);
            outputObj[key] = [];
            for (setElem of this.currentGraph[key]) {
              if (setElem instanceof Node || setElem instanceof Edge) {
                outElem = this.exportElement(setElem, cache, path + KEYPATHSEPARATOR + key + KEYPATHSEPARATOR + outputObj[key].length.toString());
              } else {
                outElem = nodeserialize.serialize(setElem, false, outElem, cache, path + KEYPATHSEPARATOR + key + KEYPATHSEPARATOR + outputObj[key].length.toString());
                console.log('Foreign Set Object');
              }
              outputObj[key].push(outElem);
            }
          } else {
            outputObj[key] = nodeserialize.serialize(this.currentGraph[key], false, outputObj[key], cache, path + KEYPATHSEPARATOR + key);
          }
        } else if (typeof this.currentGraph[key] === 'function') {
          funcStr = this.currentGraph[key].toString();
          if (ISNATIVEFUNC.test(funcStr)) {
            throw new Error('Can\'t serialize a object with a native function property.');
          }
          outputObj[key] = FUNCFLAG + funcStr;
        } else {
          outputObj[key] = this.currentGraph[key];
        }
      }
    }
    this.textBox.value = JSON.stringify(outputObj);
  }

  importGraph() {
    console.log('NYI');
  }

  // Formality, in case it's triggered by something other than us.
  resetGraph(newGraph) {
    if (newGraph instanceof Graph) {
      this.currentGraph = newGraph;
    }
  }

}
