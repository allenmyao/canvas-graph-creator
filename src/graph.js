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

    hasComponent(x, y, ignore) {
        let component = this.getComponent(x, y);
        return component !== ignore && component !== null;
    }

    getComponent(x, y) {
        let component = null;
        this.forEachNode((node) => {
            if (node.containsPoint(x, y)) {
                component = node;
                return false;
            }
        });

        if (component !== null) {
            return component;
        }

        this.forEachEdge((edge) => {
            if (edge.containsPoint(x, y)) {
                component = edge;
                return false;
            }
        });

        return component;
    }

    isNodeCollision(testNode, x, y) {
        let collision = false;
        this.forEachNode((node) => {
            if (node === testNode) {
                return;
            }
            let testPoint = node.edgePointInDirection(x, y);
            if (testNode.containsPoint(testPoint.x, testPoint.y)) {
                collision = true;
                return false;
            }
        });
        return collision;
    }

    forEachNode(callback) {
        for (let node of this.nodes) {
            if (callback(node) === false) {
                break;
            }
        }
    }

    forEachEdge(callback) {
        for (let edge of this.edges) {
            if (callback(edge) === false) {
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
