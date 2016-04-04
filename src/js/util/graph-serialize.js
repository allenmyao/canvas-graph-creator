const nodeserialize = require('node-serialize');

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

  exportGraph() {
    console.log('Serial Graph: ' + nodeserialize.serialize(this.currentGraph.nodes.values().next().value));

  }

  importGraph() {
     console.log('NYI')
  }

}
