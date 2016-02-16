var EDGE_DISTANCE_THRESHOLD = 10;
var edgeData = [];
var nodeData = [];
var r = 30;
nodeData[0] = [160, 273];
nodeData[1] = [312, 200];
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

document.getElementById("drawEdges").addEventListener("click", function(){
    calculateEdges();
});

document.getElementById("canvas").addEventListener("click", function(evt) {
    var mouse = getMousePos(canvas, evt);
    findClosestEdge(edgeData, mouse.x, mouse.y);
});

function drawBase() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 1;
    context.strokeStyle="#000000";
    drawNodes();
    drawEdges();
}

function drawEdges() {
    for(var i = 0; i < edgeData.length; i++){
        context.beginPath();
        context.moveTo(edgeData[i][0],edgeData[i][1]);
        context.quadraticCurveTo(edgeData[i][2],edgeData[i][3],edgeData[i][4],edgeData[i][5]);
        context.stroke();
    }
}

function drawNodes(){
    for(var i = 0; i < nodeData.length; i++){
        context.beginPath();
        context.arc(nodeData[i][0], nodeData[i][1], r, 0, 2*Math.PI);
        context.stroke();
    }
}

function calculateEdges() {
    var c1x = nodeData[0][0];
    var c1y = nodeData[0][1];
    var c2x = nodeData[1][0];
    var c2y = nodeData[1][1];
    var edgeNum = 4;
    r = 30;
   
    var c2xtrans = c2x - c1x;
    var c2ytrans = c2y - c1y;
    var c1xtrans = 0;
    var c1ytrans = 0;
    var theta = Math.asin(c2ytrans/Math.sqrt(c2xtrans*c2xtrans + c2ytrans*c2ytrans));
    var c1xrot = 0;
    var c1yrot = 0;
    var c2xrot = c2xtrans*Math.cos(-theta) - c2ytrans*Math.sin(-theta);
    var c2yrot = 0;
   
    edgeData = [];
    for(var i = 0; i < edgeNum; i++){
        var currTheta = (Math.PI*(i+1)/(edgeNum + 1) - Math.PI/2);
        edgeData[i] = [r*Math.cos(currTheta), r*Math.sin(currTheta),
                       c2xrot/2, c2xrot*(2*currTheta/Math.PI),
                       c2xrot - r*Math.cos(currTheta), r*Math.sin(currTheta)];
        //rotate and translate back
        for(var j = 0; j < 3; j++){
            var tempX = edgeData[i][2*j]*Math.cos(theta) - edgeData[i][2*j+1]*Math.sin(theta) + c1x;
            var tempY = edgeData[i][2*j]*Math.sin(theta) + edgeData[i][2*j+1]*Math.cos(theta) + c1y;
            edgeData[i][2*j] = tempX;
            edgeData[i][2*j+1] = tempY;
        }
    }
    drawBase();
}

function findClosestEdge(edgeData, mouseX, mouseY){
    if(edgeData.length > 0){
        drawBase();
        var shortestDist = canvas.width + canvas.height;
        var shortestIndex = 0;
        for(var i = 0; i < edgeData.length ; i++){
            var tempDist = calcBezierDistance(mouseX, mouseY, edgeData[i][0], edgeData[i][1], edgeData[i][2], edgeData[i][3], edgeData[i][4], edgeData[i][5]);
            if(shortestDist > tempDist){
                shortestDist = tempDist;
                shortestIndex = i;
            }
        }
        //highlight the edge
        if(shortestDist < EDGE_DISTANCE_THRESHOLD){
            context.beginPath();
            context.strokeStyle="#FF0000";
            context.lineWidth = 3;
            context.moveTo(edgeData[shortestIndex][0],edgeData[shortestIndex][1]);
            context.quadraticCurveTo(edgeData[shortestIndex][2],edgeData[shortestIndex][3],edgeData[shortestIndex][4],edgeData[shortestIndex][5]);
            context.stroke();
        }
    }
}

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



function calcBezierDistance(mouseX, mouseY, startX, startY, controlX, controlY, endX, endY) {
    //preliminary, commonly used values
    var aX = controlX - startX;
    var aY = controlY - startY;
    var bX = endX - controlX - aX;
    var bY = endY - controlY - aY;
    var mX = startX - mouseX;
    var mY = startY - mouseY;
    //coefficients for the cubic to be solved
    var a = bX*bX + bY*bY;
    var b = 3*(aX*bX + aY*bY);
    var c = 2*(aX*aX + aY*aY) + mX*bX + mY*bY;
    var d = mX*aX + mY*aY;
    //cubic solver adapted from: http://stackoverflow.com/questions/27176423/function-to-solve-cubic-equation-analytically
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
    //diagnostics
    var smallestX;
    var smallestY;
    //curves are parametrized as:  P(t) = (1-t)²P0 + 2t(1-t)P1 +t²P2.
    for(var j = 0; j < ans.length; j++){
        var t = ans[j];
        var curvePointX = (1 - t)*startX*(1-t) + 2*t*(1 - t)*controlX + t*t*endX;
        var curvePointY = (1 - t)*startY*(1-t) + 2*t*(1 - t)*controlY + t*t*endY;
        var tempDist = Math.sqrt((curvePointX - mouseX)*(curvePointX - mouseX) + (curvePointY - mouseY)*(curvePointY - mouseY));
        if(smallestDist > tempDist) {
            smallestDist = tempDist;
            smallestX = curvePointX;
            smallestY = curvePointY;
        }
    }
    context.lineWidth = 1;
    context.strokeStyle="#000000";
    //diagnostic drawings
    /*context.beginPath();
    context.arc(smallestX, smallestY, 5, 0, 2*Math.PI);
    context.stroke();
    context.beginPath();
    context.moveTo(mouseX,mouseY);
    context.lineTo(smallestX,smallestY);
    context.stroke();*/
    return smallestDist;
}