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

    if(typeof document !== 'undefined') {
      this.reader = new FileReader();
      this.reader.addEventListener('load', (event) => {
        this.uploadGraph();
      });

      this.uploader = document.getElementById('graph-uploader');
      this.uploader.addEventListener('change', (event) => {
        this.reader.readAsText(this.uploader.files[0]);
      });
      this.uploader.addEventListener('click', (event) => {
        this.uploader.value = null;
      });

      this.downloadBtn = document.getElementById('open-graph-button');
      this.downloadBtn.addEventListener('click', (event) => {
        this.uploader.click();
      });
      this.downloadBtn = document.getElementById('save-graph-button');
      this.downloadBtn.addEventListener('click', (event) => {
        this.downloadGraph();
      });
      this.importBtn = document.getElementById('import-graph-button');
      this.importBtn.addEventListener('click', (event) => {
        this.importGraph();
      });
      this.exportBtn = document.getElementById('export-graph-button');
      this.exportBtn.addEventListener('click', (event) => {
        this.exportGraph();
      });

      this.textBox = document.getElementById('import-export-text');
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
            console.log('Node Field Detected');
            outputObj[IDNODE + key] = elem[key].id;
          } else if (elem[key] instanceof Edge) {
            console.log('Edge Field Detected');
            outputObj[IDEDGE + key] = elem[key].id;
          } else if (elem[key] instanceof Array) {
            outputObj[key] = [];
            for (setElem of elem[key]) {
              if (setElem instanceof Node) {
                console.log('Node-Array Field Detected with id ' + setElem.id);
                outElem = IDNODE + setElem.id.toString();
              } else if (setElem instanceof Edge) {
                console.log('Edge-Array Field Detected with id ' + setElem.id);
                outElem = IDEDGE + setElem.id.toString();
              } else {
                console.log('Primitive-Array Field Detected with val ' + setElem.toString());
                outElem = setElem;
              }
              outputObj[key].push(outElem);
            }
          } else if (elem[key] instanceof Set) {
            modKey = IDSET + key;
            outputObj[modKey] = [];
            for (setElem of elem[key]) {
              if (setElem instanceof Node) {
                console.log('Node-Set Field Detected with id ' + setElem.id);
                outElem = IDNODE + setElem.id.toString();
              } else if (setElem instanceof Edge) {
                console.log('Edge-Set Field Detected with id ' + setElem.id);
                outElem = IDEDGE + setElem.id.toString();
              } else {
                console.log('Primitive-Set Field Detected with val ' + setElem.toString());
                outElem = setElem;
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

  downloadGraph() {
    let graphStr = JSON.stringify(this.serializeGraph());
    let element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(graphStr));
    element.setAttribute('download', 'graphdata.json');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  exportGraph() {
    let graphStr = JSON.stringify(this.serializeGraph());
    this.textBox.value = graphStr;
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
    return outputObj;
  }

  allocateElement(name) {
    console.log('Element allocation of type ' + name);
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
        } else if (elem[key] instanceof Array) {
          if (key.indexOf(IDSET) === 0) {
            modKey = key.substring(IDSET.length);
            console.log('Inner Set found called ' + modKey);
            newElem[modKey] = new Set();
            for (arrayElem of elem[key]) {
              if (typeof arrayElem === 'string' || arrayElem instanceof String) {
                if (arrayElem.indexOf(IDNODE) === 0) {
                  refKey = Number(arrayElem.substring(IDNODE.length));
                  newElem[modKey].add(nodeCache[refKey]);
                  console.log('Inner-Set Node found with id ' + refKey.toString());
                } else if (arrayElem.indexOf(IDEDGE) === 0) {
                  refKey = Number(arrayElem.substring(IDEDGE.length));
                  newElem[modKey].add(edgeCache[refKey]);
                  console.log('Inner-Set Edge found with id ' + refKey.toString());
                } else {
                  newElem[modKey].add(nSerial.unserialize(arrayElem, elem));
                }
              } else {
                newElem[modKey].add(nSerial.unserialize(arrayElem, elem));
              }
            }
          } else {
            console.log('Inner Array found called ' + key);
            newElem[key] = [];
            for (arrayElem of elem[key]) {
              if (typeof arrayElem === 'string' || arrayElem instanceof String) {
                if (arrayElem.indexOf(IDNODE) === 0) {
                  refKey = Number(arrayElem.substring(IDNODE.length));
                  newElem[key].push(nodeCache[refKey]);
                  console.log('Inner-Array Node found with id ' + refKey.toString());
                } else if (arrayElem.indexOf(IDEDGE) === 0) {
                  refKey = Number(arrayElem.substring(IDEDGE.length));
                  newElem[key].push(edgeCache[refKey]);
                  console.log('Inner-Array Edge found with id ' + refKey.toString());
                } else {
                  newElem[key].push(nSerial.unserialize(arrayElem, elem));
                }
              } else {
                newElem[key].push(nSerial.unserialize(arrayElem, elem));
              }
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

  uploadGraph() {
    let obj;
    if (typeof this.reader.result === 'undefined' || this.reader.result === '') {
      return;
    }
    try {
      obj = JSON.parse(this.reader.result);
    } catch (ex) {
      console.log('Exception thrown from Parser');
      return;
    }
    let deserializeInfo = this.deserializeGraph(obj);
    Node.numNodes = deserializeInfo.nodes;
    Edge.numEdged = deserializeInfo.edges
    this.resetFn(deserializeInfo.graph);
  }

  importGraph() {
    let obj;
    if (this.textBox.value === '') {
      return;
    }
    try {
      obj = JSON.parse(this.textBox.value);
    } catch (ex) {
      console.log('Exception thrown from Parser');
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
      console.log('Bad Object');
      return null;
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
