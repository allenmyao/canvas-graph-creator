import {Node} from './node';
import {Edge} from './edge';
import {drawCurvedEdge} from './drawCurvedEdge';

export class Graph {
    constructor(nodes, edges) {
        this.nodes = new Set(nodes);
        this.edges = new Set(edges);
    }

    import() {

    }

    addNode(node) {
        console.log('Adding node at (' + node.x + ',' + node.y + ')');
        this.nodes.add(node);
    }

    addEdge(edge) {
        console.log('Adding edge between ' + edge.start.id + ' and ' + edge.dest.id);
        this.edges.add(edge);
    }

//  addCurvedEdge(curvedEdge){
//     consolelog('Adding curved edge between ' + edge.start.id + ' and ' + edge.dest.id);
//     this.curverdEdges.add(curvedEdge);
//    }

    hasEdge(start, dest) {
        for (let edge of this.edges) {
            if (edge.start === start && edge.dest === dest) {
                return true;
            }
        }
        return false;
    }

    forEachNode(callback) {
        for (let node of this.nodes) {
            // console.log('node ' + node.id);
            if (callback(node) === false) {
                break;
            }
        }
    }

    draw(context) {
        this.edges.forEach((edge) => {
            edge.draw(context);
        });

        this.nodes.forEach((node) => {
            node.draw(context);
        });

    }
}
