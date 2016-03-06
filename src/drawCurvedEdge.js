


export function drawCurvedEdge(startx, starty, destx, desty, numEdge, rad) {

    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    let c1x = startx;
    let c1y = starty;
    let c2x = destx;
    let c2y = destx;
    let edgeNum = numEdge;
    let r = rad;


    context.beginPath();
    context.arc(c1x, c1y, r, 0, 2*Math.PI);
    context.stroke();
    context.beginPath();
    context.arc(c2x, c2y, r, 0, 2*Math.PI);
    context.stroke();
    let c2xtrans = c2x - c1x;
    let c2ytrans = c2y - c1y;
    // let c1xtrans = 0;
    // let c1ytrans = 0;
    let theta = Math.asin(c2ytrans/Math.sqrt(c2xtrans*c2xtrans + c2ytrans*c2ytrans));
    // let c1xrot = 0;
    // let c1yrot = 0;
    let c2xrot = c2xtrans*Math.cos(-theta) - c2ytrans*Math.sin(-theta);
    // let c2yrot = 0;

    let edgeData = [];
    for(let i = 0; i < edgeNum; i++){
        let currTheta = (Math.PI*(i+1)/(edgeNum + 1) - Math.PI/2);
        edgeData[i] = [r*Math.cos(currTheta), r*Math.sin(currTheta),
                       c2xrot/2, c2xrot*(2*currTheta/Math.PI),
                       c2xrot - r*Math.cos(currTheta), r*Math.sin(currTheta)];
        //rotate and translate back
        for(let j = 0; j < 3; j++){
            let tempX = edgeData[i][2*j]*Math.cos(theta) - edgeData[i][2*j+1]*Math.sin(theta) + c1x;
            let tempY = edgeData[i][2*j]*Math.sin(theta) + edgeData[i][2*j+1]*Math.cos(theta) + c1y;
            edgeData[i][2*j] = tempX;
            edgeData[i][2*j+1] = tempY;
        }
        context.beginPath();
                context.moveTo(edgeData[i][0],edgeData[i][1]);
                context.quadraticCurveTo(edgeData[i][2],edgeData[i][3],edgeData[i][4],edgeData[i][5]);
                context.stroke();
    }

}

