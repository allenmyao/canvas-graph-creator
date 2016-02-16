//We'll need to update the node class to contain (x,y) center values --> {cX, cY}
//this function should be a method of the edge class



function drawCurvedEdge(canvas, node1, node2, numEdge, rad) {
  
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var c1x = node1.cX;
    var c1y = node1.cY;
    var c2x = node2.cX;
    var c2y = node2.cY;
    var edgeNum = numEdge; 
    var r = rad;


    context.beginPath();
    context.arc(c1x, c1y, r, 0, 2*Math.PI);
    context.stroke();
    context.beginPath();
    context.arc(c2x, c2y, r, 0, 2*Math.PI);
    context.stroke();
    var c2xtrans = c2x - c1x;
    var c2ytrans = c2y - c1y;
    var c1xtrans = 0;
    var c1ytrans = 0;
    var theta = Math.asin(c2ytrans/Math.sqrt(c2xtrans*c2xtrans + c2ytrans*c2ytrans));
    var c1xrot = 0;
    var c1yrot = 0;
    var c2xrot = c2xtrans*Math.cos(-theta) - c2ytrans*Math.sin(-theta);
    var c2yrot = 0;
    
    var edgeData = [];
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
        context.beginPath();
				context.moveTo(edgeData[i][0],edgeData[i][1]);
				context.quadraticCurveTo(edgeData[i][2],edgeData[i][3],edgeData[i][4],edgeData[i][5]);
				context.stroke();
    }
   
}

