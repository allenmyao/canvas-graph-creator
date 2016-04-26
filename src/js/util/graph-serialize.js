const nSerial = require('node-serialize');
import { Graph } from '../data/graph';
import { Node } from '../data/node/node';
import { Edge } from '../data/edge/edge';

import { CircleNode } from '../data/node/circle-node';
import { TriangleNode } from '../data/node/triangle-node';
import { SquareNode } from '../data/node/square-node';
import { DiamondNode } from '../data/node/diamond-node';
import { PentagonNode } from '../data/node/pentagon-node';
import { HexagonNode } from '../data/node/hexagon-node';
import { OctagonNode } from '../data/node/octagon-node';

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

let classesByName = {
  CircleNode: CircleNode,
  TriangleNode: TriangleNode,
  SquareNode: SquareNode,
  DiamondNode: DiamondNode,
  PentagonNode: PentagonNode,
  HexagonNode: HexagonNode,
  OctagonNode: OctagonNode,
  SolidEdge: SolidEdge,
  DashedEdge: DashedEdge
};

export class Serializer {

  constructor(graph, resetFn) {
    this.currentGraph = graph;
    this.resetFn = resetFn;
    if(typeof document !== 'undefined'){
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
  }

  exportElement(elem, cache, path) {
    let outputObj = {};
    let key;
    let modKey;
    let setElem;
    let outElem;
    cache[path] = elem;

    console.log(elem.constructor.name + ' at ' + path);
    outputObj[IDTYPE] = elem.constructor.name;

    for (key in elem) {
      if (elem.hasOwnProperty(key)) {
        if (typeof elem[key] === 'object' && elem[key] !== null) {
          if (elem[key] instanceof Node) {
            // Node Field Detected
            outputObj[IDNODE + key] = elem[key].id;
          } else if (elem[key] instanceof Edge) {
            // Edge Field Detected
            outputObj[IDEDGE + key] = elem[key].id;
          } 

          //helper function--------------------- 
          else if (elem[key] instanceof Array || elem[key] instanceof Set) {
            if(elem[key] instanceof Set){
              modKey = IDSET + key;
              outputObj[modKey] = [];
            }
            else{
              outputObj[key] = [];
            }
            for (setElem of elem[key]) {
              if (setElem instanceof Node) {
                // Node-Array Field Detected
                outElem = IDNODE + setElem.id.toString();
              } else if (setElem instanceof Edge) {
                // Edge-Array Field Detected
                outElem = IDEDGE + setElem.id.toString();
              } else {
                // Primitive-Array Field Detected
                outElem = setElem;
              }
              outputObj[key].push(outElem);
            }
          // } else if (elem[key] instanceof Set) {
          //   modKey = IDSET + key;
          //   outputObj[modKey] = [];
          //   for (setElem of elem[key]) {
          //     if (setElem instanceof Node) {
          //       //Node-Set Field Detected
          //       outElem = IDNODE + setElem.id.toString();
          //     } else if (setElem instanceof Edge) {
          //       //Edge-Set Field Detected
          //       outElem = IDEDGE + setElem.id.toString();
          //     } else {
          //       // Primitive-Set Field Detected
          //       outElem = setElem;
          //     }
          //     outputObj[modKey].push(outElem);
          //   }
          // }
          ///-------------------------------------------
           else {
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
    let graphStr = this.serializeGraph();
    this.textBox.value = JSON.stringify(graphStr);
  }

  serializeGraph() {
    let obj = this.currentGraph;
    let cache = {};
    let path = '$';
    let outputObj = {};
    let key;
    let modKey;
    let setElem;
    let outElem;
    cache[path] = obj;

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
                // Foreign Set Object
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
    return outputObj;
  }

  allocateElement(name) {
    // Element allocation of type has type 'name'
    if (name.indexOf('Node') >= 0) {
      return new classesByName[name](0, 0);
    } else if (name.indexOf('Edge') >= 0) {
      return new classesByName[name](null, null);
    }
    return null;
  }

  importElement(elem, newElem, nodeCache, edgeCache) {
    let key;
    let modKey;
    let refKey;
    let arrayElem;
   // Element found of type 'elem[IDTYPE]''
    delete elem[IDTYPE];
    for (key in elem) {
      if (elem.hasOwnProperty(key)) {
        if (key.indexOf(IDNODE) === 0) {
          modKey = key.substring(IDNODE.length);
          newElem[modKey] = nodeCache[elem[key]];
          // Inner Node found called
        } else if (key.indexOf(IDEDGE) === 0) {
          modKey = key.substring(IDEDGE.length);
          newElem[modKey] = edgeCache[elem[key]];
          // Inner Edge found called
        } else if (elem[key] instanceof Array) {
          if (key.indexOf(IDSET) === 0) {
            modKey = key.substring(IDSET.length);
            // Inner Set found called
            newElem[modKey] = new Set();
            for (arrayElem of elem[key]) {
              if (typeof arrayElem === 'string' || arrayElem instanceof String) {
                if (arrayElem.indexOf(IDNODE) === 0) {
                  refKey = Number(arrayElem.substring(IDNODE.length));
                  newElem[modKey].add(nodeCache[refKey]);
                  // Inner-Set Node found
                } else if (arrayElem.indexOf(IDEDGE) === 0) {
                  refKey = Number(arrayElem.substring(IDEDGE.length));
                  newElem[modKey].add(edgeCache[refKey]);
                  // Inner-Set Edge found
                } else {
                  newElem[modKey].add(nSerial.unserialize(arrayElem, elem));
                }
              } else {
                newElem[modKey].add(nSerial.unserialize(arrayElem, elem));
              }
            }
          } else {
            // Inner Array found
            newElem[key] = [];
            for (arrayElem of elem[key]) {
              if (typeof arrayElem === 'string' || arrayElem instanceof String) {
                if (arrayElem.indexOf(IDNODE) === 0) {
                  refKey = Number(arrayElem.substring(IDNODE.length));
                  newElem[key].push(nodeCache[refKey]);
                  // Inner-Array Node
                } else if (arrayElem.indexOf(IDEDGE) === 0) {
                  refKey = Number(arrayElem.substring(IDEDGE.length));
                  newElem[key].push(edgeCache[refKey]);
                  // Inner-Array Edge found
                } else {
                  newElem[key].push(nSerial.unserialize(arrayElem, elem));
                }
              } else {
                newElem[key].push(nSerial.unserialize(arrayElem, elem));
              }
            }
          }
        } else if (typeof elem[key] === 'string' || elem[key] instanceof String) {
          // Inner String found
          if (elem[key].indexOf(CIRCULARFLAG) === 0) {
            throw new Error('Can\'t deserialize a circular dependency in the top-level graph.');
          } else {
            newElem[key] = elem[key];
          }
        } else {
          // Inner Generic found
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
    let obj;
    if (this.textBox.value === '') {
      return;
    }
    try {
      obj = JSON.parse(this.textBox.value);
    } catch (ex) {
      // Exception thrown from Parser
      return;
    }
    let deserializeInfo = this.deserializeGraph(obj);
    Node.numNodes = deserializeInfo.nodes;
    Edge.numEdged = deserializeInfo.edges
    this.resetFn(deserializeInfo.graph);
  }

  deserializeGraph(obj) {
    let newGraph = new Graph();
    let key;
    let modKey;
    let maxNodeID = 0;
    let nodeCache = {};
    let maxEdgeID = 0;
    let edgeCache = {};
    let elem;
    let newElem;
    if (obj === null || obj === {}) {
      // Bad Object
      return null;
    }
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key.indexOf(IDSET) === 0 && obj[key] instanceof Array) {
          modKey = key.substring(IDSET.length);
          // Set found
          newGraph[modKey] = new Set();
          for (elem of obj[key]) {
            if (elem[IDTYPE]) {
              newElem = this.allocateElement(elem[IDTYPE]);
              newElem.id = elem.id;
              newElem[IDDATA] = elem;
              if (newElem instanceof Node) {
               // Cached Node with ID
                nodeCache[newElem.id] = newElem;
                maxNodeID = Math.max(maxNodeID, newElem.id);
              } else if (newElem instanceof Edge) {
                // Cached Edge with ID
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
          // Iterating Set
          for (elem of newGraph[key]) {
            if (elem[IDDATA]) {
              this.importElement(elem[IDDATA], elem, nodeCache, edgeCache);
              delete elem[IDDATA];
            }
          }
        }
      }
    }
    return {
      nodes: maxNodeID+1, 
      edges: maxEdgeID+1, 
      graph: newGraph
    };
  }

  // Formality, in case it's triggered by something other than us.
  resetGraph(newGraph) {
    if (newGraph instanceof Graph) {
      this.currentGraph = newGraph;
    }
  }

}
