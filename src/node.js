export class Node {
    static numNodes = 0;

    id = Node.numNodes++;
    edgeList = [];
    isSelected = false;

    constructor(x, y) {
        // new.target not supported by Babel
        // if (new.target === Node) {
        //     throw TypeError('Node class is abstract; cannot construct Node instances directly');
        // }

        let methods = [
            'containsPoint',
            'distanceToPoint',
            'edgePointInDirection',
            'draw'
        ];

        for (let method of methods) {
            if (this[method] === undefined || typeof this[method] !== 'function') {
                throw TypeError('Must override method: ' + method);
            }
        }

        if (arguments.length < 2) {
            throw Error(`Node constructor requires two arguments: x, y. Actually passed in ${arguments}`);
        }
        this.x = x;
        this.y = y;
    }

    containsPoint(x, y) {
        throw Error('Can\'t call methods from abstract Node class.');
    }

    distanceToPoint(x, y) {
        throw Error('Can\'t call methods from abstract Node class.');
    }

    // rename to closestPointTo
    // modify to find closest point to another node
    edgePointInDirection(x, y) {
        throw Error('Can\'t call methods from abstract Node class.');
    }

    draw(context) {
        throw Error('Can\'t call methods from abstract Node class.');
    }

}
