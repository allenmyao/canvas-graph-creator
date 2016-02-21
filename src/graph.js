import {Node} from './node';
import {Edge} from './edge';

export class Graph {
    constructor(nodes, edges) {
        this.nodes = new Set(nodes);
        this.edges = new Set(edges);
    }

    addNode(node) {
        console.log('Adding node at (' + node.x + ',' + node.y + ')');
        this.nodes.add(node);
    }

    addEdge(edge) {
        if (!this.nodes.has(edge.start) || !this.nodes.has(edge.dest)) {
            throw new Error('Edge nodes are not in the graph');
        }

        console.log('Adding edge between ' + edge.start.id + ' and ' + edge.dest.id);
        this.edges.add(edge);
    }

    hasEdge(start, dest) {
        if (!this.nodes.has(start) || !this.nodes.has(dest)) {
            throw new Error('Nodes are not in the graph');
        }

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
