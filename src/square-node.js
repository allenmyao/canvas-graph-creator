import { Node } from './node';

export class SquareNode extends Node {

  static width = 52;

  width = SquareNode.width;
  halfwidth = SquareNode.width / 2;

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
    context.fillStyle = 'white';
    context.strokeStyle = this.isSelected ? 'red' : 'black';

    // Create a new path
    context.beginPath();

    // Create a square around (this.x, this.y)
    context.rect(this.x - this.halfwidth, this.y - this.halfwidth, this.width, this.width);

    // Draw to the canvas
    // context.fill();
    context.stroke();
  }

}
