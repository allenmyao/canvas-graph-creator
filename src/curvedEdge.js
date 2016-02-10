export class curvedEdge {


    startx = null;
    starty = null;
    cpx = null;
    cpy = null;
    destx = null;
    desty = null;

    constructor(start, dest, weight = null, isDirected = false) {
        this.start = start;
        this.dest = dest;
        this.weight = weight;
        this.isDirected = isDirected;
        this.update();
    }