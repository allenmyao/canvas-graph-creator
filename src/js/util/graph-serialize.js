const nSerial = require('node-serialize');
import { Graph } from '../data/graph';
import { Node } from '../data/node/node';
import { Edge } from '../data/edge/edge';
import { CircleNode } from '../data/node/circle-node';
import { SquareNode } from '../data/node/square-node';
import { SolidEdge } from '../data/edge/solid-edge';
import { DashedEdge } from '../data/edge/dashed-edge';

// let FUNCFLAG = '_$$ND_FUNC$$_';
let CIRCULARFLAG = '_$$ND_CC$$_';
let KEYPATHSEPARATOR = '_$$.$$_';
// let ISNATIVEFUNC = /^function\s*[^(]*\(.*\)\s*\{\s*\[native code\]\s*\}$/;
let IDTYPE = '_$$TYPE$$_';
let IDSET = '_$$SET$$_';
let IDNODE = '_$$NODE$$_';
let IDEDGE = '_$$EDGE$$_';
let IDDATA = '_$$DATA$$_';

export class Serializer {

  constructor(graph, resetFn) {
    this.currentGraph = graph;
    this.resetFn = resetFn;

    this.exportBtn = document.getElementById('export-graph-button');
    this.exportBtn.addEventListener('click', (event) => {
      this.exportGraph();
    });
    this.importBtn = document.getElementById('import-graph-button');
    this.importBtn.addEventListener('click', (event) => {
      this.importGraph();
    });

    this.textBox = document.getElementById('export-import-text');
    this.textBox.value = '';
  }

  exportElement(elem, cache, path) {
    let outputObj = {};
    let key;
    let modKey;
    let setElem;
    let outElem;
    cache[path] = elem;

    if (elem instanceof Node) {
      console.log('Node at ' + path);
      if (elem instanceof CircleNode) {
        outputObj[IDTYPE] = 'CircleNode';
      } else if (elem instanceof SquareNode) {
        outputObj[IDTYPE] = 'SquareNode';
      } else {
        outputObj[IDTYPE] = 'Node';
      }
    } else if (elem instanceof Edge) {
      console.log('Edge at ' + path);
      if (elem instanceof SolidEdge) {
        outputObj[IDTYPE] = 'SolidEdge';
      } else if (elem instanceof DashedEdge) {
        outputObj[IDTYPE] = 'DashedEdge';
      } else {
        outputObj[IDTYPE] = 'Edge';
      }
    }

    for (key in elem) {
      if (elem.hasOwnProperty(key)) {
        if (typeof elem[key] === 'object' && elem[key] !== null) {
          if (elem[key] instanceof Node) {
            console.log('Node Field Detected');
            outputObj[IDNODE + key] = elem[key].id;
          } else if (elem[key] instanceof Edge) {
            console.log('Edge Field Detected');
            outputObj[IDEDGE + key] = elem[key].id;
          } else if (elem[key] instanceof Set) {
            modKey = IDSET + key;
            outputObj[modKey] = [];
            for (setElem of elem[key]) {
              if (setElem instanceof Node) {
                console.log('Node Set Field Detected with id ' + setElem.id);
                outElem = IDNODE + setElem.id.toString();
              } else if (setElem instanceof Edge) {
                console.log('Edge Set Field Detected with id ' + setElem.id);
                outElem = IDEDGE + setElem.id.toString();
                console.log('Edge Set Field Complete');
              } else {
                outElem = nSerial.serialize(setElem, false, outElem, cache,
                    path + KEYPATHSEPARATOR + modKey + KEYPATHSEPARATOR + outputObj[modKey].length.toString());
              }
              outputObj[modKey].push(outElem);
            }
          } else {
            outputObj[key] = nSerial.serialize(elem[key], false, outputObj[key], cache, path + KEYPATHSEPARATOR + key);
          }
        } else {
          outputObj[key] = elem[key];
        }
      }
    }
    return outputObj;
  }

  exportGraph() {
    let obj = this.currentGraph;
    let cache = {};
    let path = '$';
    let outputObj = {};
    let key;
    let modKey;
    let setElem;
    let outElem;
    cache[path] = obj;

    console.log('Serial Node: ' + nSerial.serialize(obj.nodes.values().next().value));

    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (obj[key] instanceof Set) {
            modKey = IDSET + key;
            outputObj[modKey] = [];
            for (setElem of obj[key]) {
              if (setElem instanceof Node || setElem instanceof Edge) {
                outElem = this.exportElement(setElem, cache,
                    path + KEYPATHSEPARATOR + modKey + KEYPATHSEPARATOR + outputObj[modKey].length.toString());
              } else {
                outElem = nSerial.serialize(setElem, false, outElem, cache,
                    path + KEYPATHSEPARATOR + modKey + KEYPATHSEPARATOR + outputObj[modKey].length.toString());
                console.log('Foreign Set Object');
              }
              outputObj[modKey].push(outElem);
            }
          } else {
            outputObj[key] = nSerial.serialize(obj[key], false, outputObj[key], cache, path + KEYPATHSEPARATOR + key);
          }
        } else {
          outputObj[key] = obj[key];
        }
      }
    }
    this.textBox.value = JSON.stringify(outputObj);
  }

  allocateElement(name) {
    console.log('Element allocation of type ' + name);
    switch (name) {
    case 'CircleNode':
      return new CircleNode(0, 0);
    case 'SquareNode':
      return new SquareNode(0, 0);
    case 'SolidEdge':
      return new SolidEdge(null, null);
    case 'DashedEdge':
      return new DashedEdge(null, null);
    default:
      return null;
    }
  }

  importElement(elem, newElem, nodeCache, edgeCache) {
    let key;
    let modKey;
    let refKey;
    let arrayElem;
    console.log('Element found of type ' + elem[IDTYPE]);
    delete elem[IDTYPE];
    for (key in elem) {
      if (elem.hasOwnProperty(key)) {
        if (key.indexOf(IDNODE) === 0) {
          modKey = key.substring(IDNODE.length);
          newElem[modKey] = nodeCache[elem[key]];
          console.log('Inner Node found called ' + modKey + ' with id ' + elem[key].toString());
        } else if (key.indexOf(IDEDGE) === 0) {
          modKey = key.substring(IDEDGE.length);
          newElem[modKey] = edgeCache[elem[key]];
          console.log('Inner Edge found called ' + modKey + ' with id ' + elem[key].toString());
        } else if (key.indexOf(IDSET) === 0 && elem[key] instanceof Array) {
          modKey = key.substring(IDSET.length);
          console.log('Inner Set found called ' + modKey);
          newElem[modKey] = new Set();
          for (arrayElem of elem[key]) {
            if (typeof arrayElem === 'string' || arrayElem instanceof String) {
              if (arrayElem.indexOf(IDNODE) === 0) {
                refKey = Number(arrayElem.substring(IDNODE.length));
                newElem[modKey].add(nodeCache[refKey]);
                console.log('Inner Set Node found with id ' + refKey.toString());
              } else if (arrayElem.indexOf(IDEDGE) === 0) {
                refKey = Number(arrayElem.substring(IDEDGE.length));
                newElem[modKey].add(edgeCache[refKey]);
                console.log('Inner Set Edge found with id ' + refKey.toString());
              } else {
                newElem[modKey].add(nSerial.unserialize(arrayElem, elem));
              }
            } else {
              newElem[modKey].add(nSerial.unserialize(arrayElem, elem));
            }
          }
        } else if (typeof elem[key] === 'string' || elem[key] instanceof String) {
          console.log('Inner String found called ' + key);
          if (elem[key].indexOf(CIRCULARFLAG) === 0) {
            throw new Error('Can\'t deserialize a circular dependency in the top-level graph.');
          } else {
            newElem[key] = elem[key];
          }
        } else {
          console.log('Inner Generic found called ' + key);
          if (key === 'isSelected' || key === 'showTextCtrl') {
            newElem[key] = false;
          } else {
            newElem[key] = nSerial.unserialize(elem[key], elem);
          }
        }
      }
    }
    return newElem;
  }

  importGraph() {
    let newGraph = new Graph();
    let obj;
    let key;
    let modKey;
    let maxNodeID = 0;
    let nodeCache = {};
    let maxEdgeID = 0;
    let edgeCache = {};
    let elem;
    let newElem;
    if (this.textBox.value === '') {
      return;
    }
    try {
      obj = JSON.parse(this.textBox.value);
    } catch (ex) {
      console.log('Exception thrown from Parser');
      return;
    }
    if (obj === null || obj === {}) {
      console.log('Bad Object');
      return;
    }
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key.indexOf(IDSET) === 0 && obj[key] instanceof Array) {
          modKey = key.substring(IDSET.length);
          console.log('Set found called ' + modKey);
          newGraph[modKey] = new Set();
          for (elem of obj[key]) {
            if (elem[IDTYPE]) {
              newElem = this.allocateElement(elem[IDTYPE]);
              newElem.id = elem.id;
              newElem[IDDATA] = elem;
              if (newElem instanceof Node) {
                console.log('Cached Node with ID ' + newElem.id);
                nodeCache[newElem.id] = newElem;
                maxNodeID = Math.max(maxNodeID, newElem.id);
              } else if (newElem instanceof Edge) {
                console.log('Cached Edge with ID ' + newElem.id);
                edgeCache[newElem.id] = newElem;
                maxEdgeID = Math.max(maxEdgeID, newElem.id);
              }
            } else {
              newElem = nSerial.unserialize(elem, obj);
            }
            if (newElem !== null) {
              newGraph[modKey].add(newElem);
            }
          }
        } else if (typeof obj[key] === 'string' || obj[key] instanceof String) {
          if (obj[key].indexOf(CIRCULARFLAG) === 0) {
            throw new Error('Can\'t deserialize a circular dependency in the top-level graph.');
          } else {
            newGraph[key] = obj[key];
          }
        } else {
          newGraph[key] = nSerial.unserialize(obj[key], obj);
        }
      }
    }
    for (key in newGraph) {
      if (newGraph.hasOwnProperty(key)) {
        if (newGraph[key] instanceof Set) {
          console.log('Iterating Set ' + key);
          for (elem of newGraph[key]) {
            if (elem[IDDATA]) {
              this.importElement(elem[IDDATA], elem, nodeCache, edgeCache);
              delete elem[IDDATA];
            }
          }
        }
      }
    }

    Node.numNodes = maxNodeID + 1;
    Edge.numEdged = maxEdgeID + 1;
    this.resetFn(newGraph);
  }

  // Formality, in case it's triggered by something other than us.
  resetGraph(newGraph) {
    if (newGraph instanceof Graph) {
      this.currentGraph = newGraph;
    }
  }

}
