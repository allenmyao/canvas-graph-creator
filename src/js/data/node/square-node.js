import { Node } from './node';

export class SquareNode extends Node {

  static width = 52;

  width = SquareNode.width;
  halfwidth = SquareNode.width / 2;

  constructor(x, y) {
    super(x, y);
    //console.log("Square Node Ctor");
    this.generateDefaultTextLocation();
  }

  containsPoint(x, y) {
    return Math.abs(this.x - x) < this.halfwidth && Math.abs(this.y - y) < this.halfwidth;
  }

  distanceToPoint(x, y) {
    super.distanceToPoint(x, y);
  }

  edgePointInDirection(x, y) {
    if (x === this.x && y === this.y) {
      throw Error('Point is at origin of Node');
    }

    let slope = (y - this.y) / (x - this.x);
    let yintersect = y - slope * x;

    let point = {
      x: null,
      y: null
    };

    if (x > this.x) {
      // right side of square
      if (y > this.y) {
        // top of square
        if (slope > 1) {
          // right half of top edge
          point.y = this.y + this.halfwidth;
          point.x = (point.y - yintersect) / slope;
        } else if (slope < 1) {
          // top half of right edge
          point.x = this.x + this.halfwidth;
          point.y = slope * point.x + yintersect;
        } else {
          // top right corner
          point.x = this.x + this.halfwidth;
          point.y = this.y + this.halfwidth;
        }
      } else if (y < this.y) {
        // bottom of square
        if (slope > -1) {
          // bottom half of right edge
          point.x = this.x + this.halfwidth;
          point.y = slope * point.x + yintersect;
        } else if (slope < -1) {
          // right half of bottom edge
          point.y = this.y - this.halfwidth;
          point.x = (point.y - yintersect) / slope;
        } else {
          // bottom right corner
          point.x = this.x + this.halfwidth;
          point.y = this.y - this.halfwidth;
        }
      } else {
        // y is equal
        point.x = this.x + this.halfwidth;
        point.y = y;
      }
    } else if (x < this.x) {
      // left side of square
      if (y > this.y) {
        // top of square
        if (slope < -1) {
          // left half of top edge
          point.y = this.y + this.halfwidth;
          point.x = (point.y - yintersect) / slope;
        } else if (slope > -1) {
          // top half of left edge
          point.x = this.x - this.halfwidth;
          point.y = slope * point.x + yintersect;
        } else {
          // top left corner
          point.x = this.x - this.halfwidth;
          point.y = this.y + this.halfwidth;
        }
      } else if (y < this.y) {
        // bottom of square
        if (slope < 1) {
          // bottom half of left edge
          point.x = this.x - this.halfwidth;
          point.y = slope * point.x + yintersect;
        } else if (slope > 1) {
          // left half of bottom edge
          point.y = this.y - this.halfwidth;
          point.x = (point.y - yintersect) / slope;
        } else {
          // bottom left corner
          point.x = this.x - this.halfwidth;
          point.y = this.y - this.halfwidth;
        }
      } else {
        // y is equal
        point.x = this.x - this.halfwidth;
        point.y = y;
      }
    } else {
      // x is equal
      point.x = x;
      if (y > this.y) {
        point.y = this.y + this.halfwidth;
      } else {
        point.y = this.y - this.halfwidth;
      }
    }
    return point;
  }

  draw(context) {
    let xOffSet = 0;
    let yOffSet = 0;
    context.fillStyle = 'white';
    context.strokeStyle = this.isSelected ? 'red' : 'black';

    // Create a new path
    context.beginPath();

    // Create a square around (this.x, this.y)
    context.rect(this.x - this.halfwidth, this.y - this.halfwidth, this.width, this.width);

    // Draw to the canvas
    // context.fill();
    context.stroke();


    if(this.nodeLabel != ''){
      context.font = "14px Arial"
      context.fillStyle = "black";
      context.fillText(this.nodeLabel, this.xText, this.yText);
      if(this.showTextCtrl) {
        context.fillStyle = "red";
        context.beginPath();
        context.arc(this.xText, this.yText, 3.0, 0, 1.5 * Math.PI);
        context.lineTo(this.xText, this.yText);
        context.fill();
      }
    }

    if (this.isAcceptingState) {
      context.moveTo(this.x - this.halfwidth * 0.75, this.y - this.halfwidth * 0.75);
      context.rect(this.x - this.halfwidth * 0.75, this.y - this.halfwidth * 0.75, this.width * 0.75, this.width * 0.75);
      context.stroke();
    }

    if (this.isStartingState) {
      context.fillStyle = this.isSelected ? 'red' : 'black';
      context.moveTo(this.x - 60, this.y - 60);
      context.lineTo(this.x - 30, this.y - 30);
      context.stroke();
      context.beginPath();
      context.moveTo(this.x - 30, this.y - 30);
      context.lineTo(this.x - 30 - 6 - 3, this.y - 30 - 6 + 3);
      context.lineTo(this.x - 30 - 6, this.y - 30 - 6);
      context.lineTo(this.x - 30 - 6 + 3, this.y - 30 - 6 - 3);
      context.closePath();
      context.fill();
    }
  }

  //find the starting point of our text box
  generateDefaultTextLocation() {
    this.xText = this.x + this.halfwidth + 4;
    this.yText = this.y;
    //console.log("Half: " + this.halfwidth + ", xText: " + this.xText + ", yText: " + this.yText);
  }


}
