const nSerial = require('node-serialize');
import { Graph } from '../data/graph';
import { Node } from '../data/node/node';
import { Edge } from '../data/edge/edge';
import { Label } from '../data/label';

import { CircleNode } from '../data/node/circle-node';
import { TriangleNode } from '../data/node/triangle-node';
import { SquareNode } from '../data/node/square-node';
import { DiamondNode } from '../data/node/diamond-node';
import { PentagonNode } from '../data/node/pentagon-node';
import { HexagonNode } from '../data/node/hexagon-node';
import { OctagonNode } from '../data/node/octagon-node';

import { SolidEdge } from '../data/edge/solid-edge';
import { DashedEdge } from '../data/edge/dashed-edge';

let CIRCULARFLAG = '_$$ND_CC$$_';
let KEYPATHSEPARATOR = '_$$.$$_';
let IDTYPE = '_$$TYPE$$_';
let IDSET = '_$$SET$$_';
let IDNODE = '_$$NODE$$_';
let IDEDGE = '_$$EDGE$$_';
let IDLABEL = '_$$LABEL$$_';
let IDDATA = '_$$DATA$$_';

/**
 * Serializer class takes care of saving
 * and loading graph via JSON manipulation
 */
export class Serializer {

  static classesByName = {
    CircleNode: CircleNode,
    TriangleNode: TriangleNode,
    SquareNode: SquareNode,
    DiamondNode: DiamondNode,
    PentagonNode: PentagonNode,
    HexagonNode: HexagonNode,
    OctagonNode: OctagonNode,
    SolidEdge: SolidEdge,
    DashedEdge: DashedEdge,
    Label: Label
  };

  /**
   * Serializer constructor
   * @param {Graph} graph Current graph structure
   * @param {function} resetFn function to reset graph
   */
  constructor(graph, resetFn) {
    this.currentGraph = graph;
    this.resetFn = resetFn;
    this.quickString = '';

    if (typeof document !== 'undefined') {
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

      this.downloadBtn = document.getElementById('load-graph-button');
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
    }
  }

   /**
   * Exports element of graph in object form
   * @param {Object} elem is the element of graph to be exported
   * @param {Object} cache is a remnant of the original serializer
   * @param {string} path is a remnant of the original serializer
   * @returns {Object} outputObj contains the element object data
   */
  exportElement(elem, cache, path) {
    let outputObj = {};
    let key;
    let modKey;
    let setElem;
    let outElem;
    cache[path] = elem;

    outputObj[IDTYPE] = elem.constructor.name;

    for (key in elem) {
      if (elem.hasOwnProperty(key)) {
        if (typeof elem[key] === 'object' && elem[key] !== null) {
          if (elem[key] instanceof Label) {
            outputObj[IDLABEL + key] = this.exportElement(elem[key], cache, path + KEYPATHSEPARATOR + IDLABEL + key);
          } else if (elem[key] instanceof Node) {
            // Node Field Detected
            outputObj[IDNODE + key] = elem[key].id;
          } else if (elem[key] instanceof Edge) {
            // Edge Field Detected
            outputObj[IDEDGE + key] = elem[key].id;
          } else if (elem[key] instanceof Array || elem[key] instanceof Set) {
            if (elem[key] instanceof Set) {
              modKey = IDSET + key;
            } else {
              modKey = key;
            }
            outputObj[modKey] = [];
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

  /**
   * Is called when user wants to download the graph
   */
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

  /**
   * Sets value of textbox to the serialzed graph in JSON form
   */
  exportGraph() {
    let graphStr = JSON.stringify(this.serializeGraph());
    this.quickString = graphStr;
  }

  /**
   * Abstracts graph into outputOBj
   * @returns {Object} outputObj JSON object that can be stringified, contains graph data
   */
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

  /**
   * Helper function to construct empty objects by class name
   * @param {string} name of element tyoe to allocate
   * @returns {Object} the constructed object
   */
  allocateElement(name) {
    // Element allocation of type has type 'name'
    if (name.indexOf('Node') >= 0) {
      return new Serializer.classesByName[name](0, 0);
    } else if (name.indexOf('Edge') >= 0) {
      return new Serializer.classesByName[name](null, null);
    } else if (name.indexOf('Label') >= 0) {
      return new Serializer.classesByName[name](0, 0, null);
    }
    return null;
  }

  /**
   * Reads the elem contents and converts it to a raw JSON object newElem
   * @param {Object} elem is the element of graph to be imported
   * @param {Object} newElem is the return element and contains the imported data
   * @param {Object} nodeCache allows for loading references to existing nodes
   * @param {Object} edgeCache allows for loading references to existing edges
   * @returns {Object} newElem a fully initialized graph element.
   */
  importElement(elem, newElem, nodeCache, edgeCache) {
    let key;
    let modKey;
    let refKey;
    let arrayElem;
    let addObj;
   // Element found of type 'elem[IDTYPE]'
    delete elem[IDTYPE];
    for (key in elem) {
      if (elem.hasOwnProperty(key)) {
        if (key.indexOf(IDLABEL) === 0) {
          modKey = key.substring(IDLABEL.length);
          newElem[modKey] = this.importElement(elem[key], this.allocateElement(elem[key][IDTYPE]), nodeCache, edgeCache);
        } else if (key.indexOf(IDNODE) === 0) {
          modKey = key.substring(IDNODE.length);
          newElem[modKey] = nodeCache[elem[key]];
          // Inner Node found called
        } else if (key.indexOf(IDEDGE) === 0) {
          modKey = key.substring(IDEDGE.length);
          newElem[modKey] = edgeCache[elem[key]];
          // Inner Edge found called
        } else if (elem[key] instanceof Array) {
          if (key.indexOf(IDSET) === 0) {
            // Inner Set found
            modKey = key.substring(IDSET.length);
            newElem[modKey] = new Set();
          } else {
            // Inner Array found
            modKey = key;
            newElem[modKey] = [];
          }
          for (arrayElem of elem[key]) {
            if (typeof arrayElem === 'string' || arrayElem instanceof String) {
              if (arrayElem.indexOf(IDNODE) === 0) {
                refKey = Number(arrayElem.substring(IDNODE.length));
                addObj = nodeCache[refKey];
                // Inner-Set Node found
              } else if (arrayElem.indexOf(IDEDGE) === 0) {
                refKey = Number(arrayElem.substring(IDEDGE.length));
                addObj = edgeCache[refKey];
                // Inner-Set Edge found
              } else {
                addObj = nSerial.unserialize(arrayElem, elem);
              }
            } else {
              addObj = nSerial.unserialize(arrayElem, elem);
            }
            if (newElem[modKey] instanceof Set) {
              newElem[modKey].add(addObj);
            } else {
              newElem[modKey].push(addObj);
            }
          }
        } else if (typeof elem[key] === 'string' || elem[key] instanceof String) {
          // Inner String found
          if (elem[key].indexOf(CIRCULARFLAG) === 0) {
            throw new Error('Can\'t deserialize a circular dependency in the top-level graph.');
          } else {
            newElem[key] = elem[key];
          }
        } else if (key === 'isSelected' || key === 'showTextCtrl') {
          // Inner Generic found
          newElem[key] = false;
        } else {
          newElem[key] = nSerial.unserialize(elem[key], elem);
        }
      }
    }
    return newElem;
  }

  /**
   * Will not run if the JSON reader fails. Loads the graph from JSON file
   */
  uploadGraph() {
    let obj;
    let deserializeInfo;
    if (typeof this.reader.result === 'undefined' || this.reader.result === '') {
      return;
    }
    try {
      obj = JSON.parse(this.reader.result);
      deserializeInfo = this.deserializeGraph(obj);
    } catch (ex) {
      // Exception thrown from parser or deserializer. Abort.
      return;
    }
    Node.numNodes = deserializeInfo.nodes;
    Edge.numEdges = deserializeInfo.edges;
    this.resetFn(deserializeInfo.graph);
  }

  /**
   * Imports the graph from JSON string
   */
  importGraph() {
    let obj;
    let deserializeInfo;
    if (this.quickString === '') {
      return;
    }
    try {
      obj = JSON.parse(this.quickString);
      deserializeInfo = this.deserializeGraph(obj);
    } catch (ex) {
      // Exception thrown from parser or deserializer. Abort.
      return;
    }
    Node.numNodes = deserializeInfo.nodes;
    Edge.numEdges = deserializeInfo.edges;
    this.resetFn(deserializeInfo.graph);
  }

  /**
   * Reads the graph data and creates new elements accordingly
   * @param {Object} obj is the graph data contained in obj
   * @returns {Object} data containing the graph and nodes and edge counts
   */
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
      nodes: maxNodeID + 1,
      edges: maxEdgeID + 1,
      graph: newGraph
    };
  }

  /**
   * Resets the graph
   * @param {Graph} newGraph is the graph data to reset with
   */
  resetGraph(newGraph) {
     // Formality, in case it's triggered by something other than us.
    if (newGraph instanceof Graph) {
      this.currentGraph = newGraph;
    }
  }

}
