const nodeserialize = require('node-serialize');
import { Graph } from '../data/graph';
import { Node } from '../data/node/node';
import { Edge } from '../data/edge/edge';

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
    this.importBtn.addEventListener('click', (event) => {
      this.importGraph();
    });
  }

	exportNode(node, cache, path) {
		console.log('Node at ' + path)
		return {}
	}

	exportEdge(edge, cache, path) {
		console.log('Edge at ' + path)
		return {}
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

    for(key in this.currentGraph) {
      if(this.currentGraph.hasOwnProperty(key)) {
        if(typeof this.currentGraph[key] === 'object' && this.currentGraph[key] !== null) {
          if (this.currentGraph[key] instanceof Set && (key === 'edges' || key === 'nodes')) {
						console.log("Known Set Detected with size " + this.currentGraph[key].size);
						outputObj[key] = []
						for (setElem of this.currentGraph[key]) {
							if (setElem instanceof Node) {
								outElem = this.exportNode(setElem, cache, path + KEYPATHSEPARATOR + key + KEYPATHSEPARATOR + outputObj[key].length.toString());
							} else if (setElem instanceof Edge) {
								outElem = this.exportEdge(setElem, cache, path + KEYPATHSEPARATOR + key + KEYPATHSEPARATOR + outputObj[key].length.toString());
							} else {
								outElem = nodeserialize.serialize(setElem, false, outElem, cache, path + KEYPATHSEPARATOR + key + KEYPATHSEPARATOR + outputObj[key].length.toString());
								console.log("Foreign Set Object");
							}
							outputObj[key].push(outElem);
						}
					} else {
            outputObj[key] = nodeserialize.serialize(this.currentGraph[key], false, outputObj[key], cache, path + KEYPATHSEPARATOR + key);
          }
        } else if(typeof this.currentGraph[key] === 'function') {
          funcStr = this.currentGraph[key].toString();
          if(ISNATIVEFUNC.test(funcStr)) {
            throw new Error('Can\'t serialize a object with a native function property.');
          }
          outputObj[key] = FUNCFLAG + funcStr;
        } else {
          outputObj[key] = this.currentGraph[key];
        }
      }
    }

		console.log('Serial Graph: ' + JSON.stringify(outputObj));
  }

  importGraph() {
     console.log('NYI')
  }

  // Formality, in case it's triggered by something other than us.
  resetGraph(newGraph) {
		if (newGraph instanceof Graph) {
    	this.currentGraph = newGraph;
		}
  }

}
