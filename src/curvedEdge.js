    

            var EDGE_DISTANCE_THRESHOLD = 10;
            var DEFAULT_RADIUS = 30;
            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');

            //cleanvs the canvas
            function resetCanvas() {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }

            //sets style. call prior to drawEdge or drawNode
            //lineColor: hex string that defines color (ex: "#FF0000")
            //width: width of line
            function setStyle(lineColor, width){
                context.strokeStyle = "#FF0000";
                context.lineWidth = width;
            }

            //drawing function, draws edges
            //edge: edge Object to be drawn
            function drawEdge(edge){
                context.beginPath();
                context.moveTo(edge.startX, edge.startY);
                context.quadraticCurveTo(edge.controlX, edge.controlY, edge.endX, edge.endY);
                context.stroke();


            //drawing function, draws nodes
            //node: node Object to be drawn
            function drawNode(node){
                context.beginPath();
                context.arc(node.x, node.y, DEFAULT_RADIUS, 0, 2*Math.PI);
                context.stroke();
            }

            //generates generic canvas drawing data for a given number of edges between two nodes
            //arguments:
            //startNode: starting Node object
            //endNode: ending Node object
            //edgeNum: number of edges between the nodes
            //type: (currently unused) specifies type of edge (directed? self-loop?)
            //returns:
            //an array of Edge objects
            function calculateEdges(startNode, endNode, edgeNum, type) {
                var c1x = startNode.x;
                var c1y = startNode.y;
                var c2x = endNode.x;
                var c2y = endNode.y;
                var r = DEFAULT_RADIUS;
               
                //auxiliary variables for conceptual understanding
                //will be refactored if needed
                var c2xtrans = c2x - c1x;
                var c2ytrans = c2y - c1y;
                var c1xtrans = 0;
                var c1ytrans = 0;
                var theta = Math.asin(c2ytrans/Math.sqrt(c2xtrans*c2xtrans + c2ytrans*c2ytrans));
                var c1xrot = 0;
                var c1yrot = 0;
                var c2xrot = c2xtrans*Math.cos(-theta) - c2ytrans*Math.sin(-theta);
                var c2yrot = 0;
               
                var edges = [];
                for(var i = 0; i < edgeNum; i++){
                    var currTheta = (Math.PI*(i+1)/(edgeNum + 1) - Math.PI/2);
                    var edgedata = [r*Math.cos(currTheta), r*Math.sin(currTheta),
                                   c2xrot/2, c2xrot*(2*currTheta/Math.PI),
                                   c2xrot - r*Math.cos(currTheta), r*Math.sin(currTheta)];
                    //rotate and translate back
                    for(var j = 0; j < 3; j++){
                        var tempX = edgedata[2*j]*Math.cos(theta) - edgedata[2*j+1]*Math.sin(theta) + c1x;
                        var tempY = edgedata[2*j]*Math.sin(theta) + edgedata[2*j+1]*Math.cos(theta) + c1y;
                        edgedata[2*j] = tempX;
                        edgedata[2*j+1] = tempY;
                    }


                  edges[edges.length] = new Edge(startNode, endNode, edgedata[0], edgedata[1], edgedata[2],
                                                   edgedata[3], edgedata[4], edgedata[5]);
                }
                return edges;
            }

            //returns the closest edge in the array to the specified point, or false if it's not within the default threshold or if the array is empty
            //arguments:
            //edges: an array of Edge objects to be examined
            //pointX, pointY: numerical values that represent the location of the point
            //returns false if edges is empty or if the edge is not within the standard threshold
            function findClosestEdge(edges, pointX, pointY){
                if(edges.length > 0){
                    var shortestDist = canvas.width + canvas.height;
                    var shortestIndex = 0;
                    for(var i = 0; i < edges.length ; i++){
                        //calls the helper function to find the distance
                        var tempDist = calcBezierDistance(pointX, pointY, edges[i].startX, edges[i].startY, edges[i].controlX, edges[i].controlY, edges[i].endX, edges[i].endY);
                        if(shortestDist > tempDist){
                            shortestDist = tempDist;
                            shortestIndex = i;
                        }
                    }
                   
                    if(shortestDist < EDGE_DISTANCE_THRESHOLD){
                        return edges[shortestIndex];
                    }
                    return false;
                    //highlight the edge
                }
                return false;
            }

            //the following two functions adapted from: http://stackoverflow.com/questions/27176423/function-to-solve-cubic-equation-analytically
            //calculates cube root
            //self-explanatory
            function cuberoot(x) {
                var y = Math.pow(Math.abs(x), 1/3);
                return x < 0 ? -y : y;
            }

            function solveCubic(a, b, c, d) {
                if (Math.abs(a) < 1e-8) { // Quadratic case, ax^2+bx+c=0
                    a = b; b = c; c = d;
                    if (Math.abs(a) < 1e-8) { // Linear case, ax+b=0
                        a = b; b = c;
                        if (Math.abs(a) < 1e-8) // Degenerate case
                            return [];
                        return [-b/a];
                    }

                    var D = b*b - 4*a*c;
                    if (Math.abs(D) < 1e-8)
                        return [-b/(2*a)];
                    else if (D > 0)
                        return [(-b+Math.sqrt(D))/(2*a), (-b-Math.sqrt(D))/(2*a)];
                    return [];
                }

                // Convert to depressed cubic t^3+pt+q = 0 (subst x = t - b/3a)
                var p = (3*a*c - b*b)/(3*a*a);
                var q = (2*b*b*b - 9*a*b*c + 27*a*a*d)/(27*a*a*a);
                var roots;

                if (Math.abs(p) < 1e-8) { // p = 0 -> t^3 = -q -> t = -q^1/3
                    roots = [cuberoot(-q)];
                } else if (Math.abs(q) < 1e-8) { // q = 0 -> t^3 + pt = 0 -> t(t^2+p)=0
                    roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
                } else {
                    var D = q*q/4 + p*p*p/27;
                    if (Math.abs(D) < 1e-8) {       // D = 0 -> two roots
                        roots = [-1.5*q/p, 3*q/p];
                    } else if (D > 0) {             // Only one real root
                        var u = cuberoot(-q/2 - Math.sqrt(D));
                        roots = [u - p/(3*u)];
                    } else {                        // D < 0, three roots, but needs to use complex numbers/trigonometric solution
                        var u = 2*Math.sqrt(-p/3);
                        var t = Math.acos(3*q/p/u)/3;  // D < 0 implies p < 0 and acos argument in [-1..1]
                        var k = 2*Math.PI/3;
                        roots = [u*Math.cos(t), u*Math.cos(t-k), u*Math.cos(t-2*k)];
                    }
                }

                // Convert back from depressed cubic
                for (var i = 0; i < roots.length; i++)
                    roots[i] -= b/(3*a);

                return roots;
            }


            //helper function that calculates the distance between a specified point and a quadratic bezier
            function calcBezierDistance(pointX, pointY, startX, startY, controlX, controlY, endX, endY) {
                //preliminary, commonly used values
                var aX = controlX - startX;
                var aY = controlY - startY;
                var bX = endX - controlX - aX;
                var bY = endY - controlY - aY;
                var mX = startX - pointX;
                var mY = startY - pointY;
               
                //coefficients for the cubic to be solved
                var a = bX*bX + bY*bY;
                var b = 3*(aX*bX + aY*bY);
                var c = 2*(aX*aX + aY*aY) + mX*bX + mY*bY;
                var d = mX*aX + mY*aY;
                var ans = solveCubic(a, b, c, d);
               
                //reject any that violates x = [0, 1]
                for(var i = ans.length - 1; i >= 0; i--) {
                    if(ans[i] > 1 || ans[i] < 0) {
                       ans.splice(i, 1);
                    }
                }
                ans[ans.length] = 0;
                ans[ans.length] = 1; //edge cases
               
                //minimize dist
                var smallestDist = canvas.width + canvas.height;
                //diagnostic values
                //var smallestX;
                //var smallestY;
               
                //curves are parametrized as:  P(t) = (1-t)²P0 + 2t(1-t)P1 +t²P2.
                for(var j = 0; j < ans.length; j++){
                    var t = ans[j];
                    var curvePointX = (1 - t)*startX*(1-t) + 2*t*(1 - t)*controlX + t*t*endX;
                    var curvePointY = (1 - t)*startY*(1-t) + 2*t*(1 - t)*controlY + t*t*endY;
                    var tempDist = Math.sqrt((curvePointX - pointX)*(curvePointX - pointX) + (curvePointY - pointY)*(curvePointY - pointY));
                    if(smallestDist > tempDist) {
                        smallestDist = tempDist;
                        //smallestX = curvePointX;
                        //smallestY = curvePointY;
                    }
                }
                context.lineWidth = 1;
                context.strokeStyle="#000000";
               
                //diagnostic drawings
                /*context.beginPath();
                context.arc(smallestX, smallestY, 5, 0, 2*Math.PI);
                context.stroke();
                context.beginPath();
                context.moveTo(pointX,pointY);
                context.lineTo(smallestX,smallestY);
                context.stroke();*/
               
                return smallestDist;
            }





function bezierDerivative(t, startX, startY, controlX, controlY, endX, endY) {
    return {
        x: (2*t-2)*startX + (2-4*t)*controlX + 2*t*endX,
        y: (2*t-2)*startY + (2-4*t)*controlY + 2*t*endY
    };
}

function bezierPoint(t, startX, startY, controlX, controlY, endX, endY) {
    return {
        x: (1-t)*(1-t)*startX + 2*(1-t)*t*controlX + t*t*endX,
        y: (1-t)*(1-t)*startY + 2*(1-t)*t*controlY + t*t*endY
    }
}

function drawArrows(edge, start, end){
    var slope, length;
    if(start) {
        slope = bezierDerivative(0, edge.startX, edge.startY, edge.controlX,
                                    edge.controlY, edge.endX, edge.endY);
        length = Math.sqrt(slope.x*slope.x + slope.y*slope.y);
        //normalize slope
        slope = { x: slope.x/length, y: slope.y/length };
        //perpendicular:
        context.fillStyle = '#000000';
        context.beginPath();
        context.moveTo(edge.startX, edge.startY);
        context.lineTo(edge.startX + 15*slope.x - 5*slope.y,
                       edge.startY + 15*slope.y + 5*slope.x);
        context.lineTo(edge.startX + 9*slope.x, edge.startY + 9*slope.y);
        context.lineTo(edge.startX + 15*slope.x + 5*slope.y,
                       edge.startY + 15*slope.y - 5*slope.x);
        context.closePath();
        context.fill();
    }
    if(end) {
        slope = bezierDerivative(1, edge.startX, edge.startY, edge.controlX,
                                    edge.controlY, edge.endX, edge.endY);
        length = Math.sqrt(slope.x*slope.x + slope.y*slope.y);
        //normalize slope
        slope = { x: slope.x/length, y: slope.y/length };
        //perpendicular:
        context.fillStyle = '#000000';
        context.beginPath();
        context.moveTo(edge.endX, edge.endY);
        context.lineTo(edge.endX - 15*slope.x - 5*slope.y,
                       edge.endY - 15*slope.y + 5*slope.x);
        context.lineTo(edge.endX - 9*slope.x, edge.endY - 9*slope.y);
        context.lineTo(edge.endX - 15*slope.x + 5*slope.y,
                       edge.endY - 15*slope.y - 5*slope.x);
        context.fill();
    }
}

function drawLabel(edge, label){
    var slope = bezierDerivative(0.5, edge.startX, edge.startY, edge.controlX,
                                    edge.controlY, edge.endX, edge.endY);
    var length = Math.sqrt(slope.x*slope.x + slope.y*slope.y);
    slope = { x: slope.x/length, y: slope.y/length };
    var point = bezierPoint(0.5, edge.startX, edge.startY, edge.controlX,
                               edge.controlY, edge.endX, edge.endY);
    context.font = "12px Arial";
    context.fillText(label, point.x + 12*slope.y, point.y - 12*slope.x);
}

function calculateLoop(node, angle) {
    var edge = [];
    var theta = Math.PI*angle/180;
    var r = DEFAULT_RADIUS;
    return new Edge(node, node,
             r*Math.cos(theta)+node.x, r*Math.sin(theta)+node.y,
             4*r*Math.cos(theta+Math.PI/8)+node.x, 4*r*Math.sin(theta+Math.PI/8)+node.y,
             r*Math.cos(theta+Math.PI/4)+node.x, r*Math.sin(theta+Math.PI/4)+node.y);
}