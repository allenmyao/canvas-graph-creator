import { calcBezierDistance, bezierDerivative } from '../../util/bezier';
import Point2D from '../../util/point-2d';
import Triangle2D from '../../util/triangle-2d';
import Line2D from '../../util/line-2d';
import Label from '../label';

const EDGE_DISTANCE_THRESHOLD = 10;

/**
 * Data representation of a graph edge.
 * @class Edge
 */
class Edge {

  static numEdges = 0;
  id = Edge.numEdges++;

  // Line Control
  startPoint = { x: 0, y: 0 };
  bezierPoint = { x: 0, y: 0 };
  destPoint = { x: 0, y: 0 };

  // graph data
  startNode = null;
  destNode = null;
  isDirected = false;
  partners = [];

  // status
  isSelected = false;

  // label
  label;

  // appearance
  color = '#000000';
  selectedColor = '#FF0000';
  lineWidth = 1;

  /**
   * Constructs an Edge instance. Should not be called directly.
   * @param  {Node} startNode - Start node of the edge.
   * @param  {Node} destNode - Destination node of the edge.
   * @constructs Edge
   */
  constructor(startNode, destNode) {
    if (typeof startNode === 'undefined' || typeof destNode === 'undefined') {
      throw Error(`Edge constructor requires at least two arguments: startNode and destNode. Actually passed in ${startNode}, ${destNode}`);
    }

    this.startNode = startNode;
    this.destNode = destNode;

    if (this.startNode !== null && this.destNode !== null) {
      this.startNode.edges.add(this);
      this.destNode.edges.add(this);

      // copy partners from an existing partner edge
      for (let edge of this.startNode.edges) {
        if (edge.startNode === this.startNode && edge.destNode === this.destNode) {
          this.partners = edge.partners.slice(0);
          break;
        } else if (edge.destNode === this.startNode && edge.startNode === this.destNode) {
          this.partners = edge.partners.slice(0);
          break;
        }
      }

      // add this edge to partners field of all partner edges
      for (let i = 0; i < this.partners.length; i++) {
        this.partners[i].partners.push(this);
      }
      this.partners.push(this);

      if (this.startNode === this.destNode) {
        this.isDirected = true;
        this.updateEndpoints();
      } else {
        for (let i = 0; i < this.partners.length; i++) {
          this.partners[i].updateEndpoints();
        }
      }
    } else {
      this.partners.push(this);
    }

    this.label = new Label(this.bezierPoint.x, this.bezierPoint.y, this);
  }

  /**
   * Remove the edge from all other graph objects associated with it.
   */
  detach() {
    // remove this edge from partners of all partner edges
    for (let i = 0; i < this.partners.length; i++) {
      if (this.partners[i] === this) {
        continue;
      }
      let index = this.partners[i].partners.indexOf(this);
      this.partners[i].partners.splice(index, 1);
      this.partners[i].updateEndpoints();
    }
    this.partners = [];
    this.partners.push(this);

    if (this.startNode !== null) {
      this.startNode.edges.delete(this);
    }
    if (this.destNode !== null) {
      this.destNode.edges.delete(this);
    }
    this.startNode = null;
    this.destNode = null;
  }

  /**
   * Update endpoints for a self-loop edge. Called by updateEndpoints().
   */
  updateSelfLoopEndpoints() {
    this.startPoint = this.startNode.getAnglePoint(240);
    this.destPoint = this.startNode.getAnglePoint(300);
    this.bezierPoint = {
      x: (this.startPoint.x + this.destPoint.x) / 2,
      y: this.startPoint.y - 2 * this.startNode.radius
    };
  }

  /**
   * Update endpoints for a normal edge. Called by updateEndpoints().
   */
  updateNormalEdgeEndpoints() {
    let dx = this.destNode.x - this.startNode.x;
    let dy = this.destNode.y - this.startNode.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // calculate incline based on dy and distance
    // this is the angle between x-axis and the line from startNode to destNode
    let incline = Math.asin(dy / distance);
    // convert from radians to degrees
    incline = incline * 180 / Math.PI;

    // Note that canvas coordinates increase towards the bottom right
    // Quadrants are oriented as follows:
    //       |
    //   Q3  |  Q4
    //       |
    // ------------- +x
    //       |
    //   Q2  |  Q1
    //       |
    //       +y
    //

    // if destNode.x < startNode.x, the angle should end:
    //   in the second quadrant if destNode.y > startNode.y
    //   in the third quadrant if destNode.y < startNode.y
    if (this.startNode.x >= this.destNode.x) {
      if (this.startNode.y >= this.destNode.y) {
        incline = (540 - incline) % 360;
      } else {
        incline = 180 - incline;
      }
    }

    let numPartners = this.partners.length + 1;
    let multiIndex = this.partners.indexOf(this) + 1;

    let ratio = multiIndex / numPartners;

    // if the partner edge with index 0 is going in the opposite direction compared to the current edge
    // then draw the current edge on the opposite side of the line connecting the two nodes
    if (this.partners[0].startNode !== this.startNode) {
      ratio = 1 - ratio;
    }

    let startAngle = incline + 90 * ratio - 45;
    let destAngle = incline + 225 - 90 * ratio;
    this.startPoint = this.startNode.getAnglePoint(startAngle);
    this.destPoint = this.destNode.getAnglePoint(destAngle);

    let orient = ratio - 0.5;
    let diff = {
      x: this.destPoint.x - this.startPoint.x,
      y: this.destPoint.y - this.startPoint.y
    };
    this.bezierPoint = {
      x: (this.startPoint.x + this.destPoint.x) / 2 - orient * diff.y,
      y: (this.startPoint.y + this.destPoint.y) / 2 + orient * diff.x
    };
  }

  /**
   * Update the endpoints of the edge.
   */
  updateEndpoints() {
    let oldStartPoint = this.startPoint;
    let oldBezierPoint = this.bezierPoint;
    let oldDestPoint = this.destPoint;
    if (this.startNode === this.destNode) {
      this.updateSelfLoopEndpoints();
    } else {
      this.updateNormalEdgeEndpoints();
    }
    if (this.label) {
      if (oldStartPoint === null || oldBezierPoint === null || oldDestPoint === null) {
        // initial label location
        this.label.x = this.bezierPoint.x;
        this.label.y = this.bezierPoint.y;
      } else if (this.startNode === this.destNode) {
        // self loop case
        this.updateSelfLoopLabel(oldBezierPoint);
      } else {
        let oldStartPoint2D = new Point2D(oldStartPoint.x, oldStartPoint.y);
        let oldBezierPoint2D = new Point2D(oldBezierPoint.x, oldBezierPoint.y);
        let oldDestPoint2D = new Point2D(oldDestPoint.x, oldDestPoint.y);

        let startPoint2D = new Point2D(this.startPoint.x, this.startPoint.y);
        let bezierPoint2D = new Point2D(this.bezierPoint.x, this.bezierPoint.y);
        let destPoint2D = new Point2D(this.destPoint.x, this.destPoint.y);

        let oldStartDest = new Line2D(oldStartPoint2D, oldDestPoint2D);
        let startDest = new Line2D(startPoint2D, destPoint2D);
        if (startDest.hasPoint(bezierPoint2D)) {
          if (startPoint2D.equals(destPoint2D)) {
            // corner case where startPoint == endPoint
            this.label.x = startPoint2D.x;
            this.label.y = startPoint2D.y;
          }

          // straight edge case
          if (!oldStartDest.hasPoint(oldBezierPoint2D)) {
            // was previously a bezier curve, so reset coordinates to bezierPoint
            this.label.x = this.bezierPoint.x;
            this.label.y = this.bezierPoint.y;
            return;
          }
          this.updateStraightEdgeLabel(oldStartPoint2D, oldBezierPoint2D, oldDestPoint2D, startPoint2D, bezierPoint2D, destPoint2D);
        } else {
          if (oldStartDest.hasPoint(oldBezierPoint2D)) {
            // was previously a straight line, so reset coordinates to bezierPoint
            this.label.x = this.bezierPoint.x;
            this.label.y = this.bezierPoint.y;
            return;
          }
          // curved edge
          this.updateCurvedEdgeLabel(oldStartPoint2D, oldBezierPoint2D, oldDestPoint2D, startPoint2D, bezierPoint2D, destPoint2D);
        }
      }
    }
  }

  /**
   * Check if the edge contains a given point (within a distance threshold).
   * @param  {number} x - x-coordinate of the point.
   * @param  {number} y - y-coordinate of the point.
   * @return {boolean} - Whether or not the edge contains the point.
   */
  containsPoint(x, y) {
    return EDGE_DISTANCE_THRESHOLD > calcBezierDistance(x, y, this.startPoint, this.bezierPoint, this.destPoint);
  }

  /**
   * Draw the edge on the given canvas context.
   * @param  {CanvasRenderingContext2D} context - Canvas 2D context.
   * @throws {Error} - Throws error if called.
   * @abstract
   */
  draw(context) {
    throw Error('Can\'t call draw from abstract Edge class.');
  }

  /**
   * Draw the Label object associated with this edge.
   * @param  {CanvasRenderingContext2D} context - Canvas 2D context.
   */
  drawLabel(context) {
    this.label.draw(context);
  }

  /**
   * Draw an arrow on the destination side of the edge on the given context.
   * @param  {CanvasRenderingContext2D} context - Canvas 2D context.
   */
  drawArrow(context) {
    let slope = bezierDerivative(1, this.startPoint, this.bezierPoint, this.destPoint);
    let length = Math.sqrt(slope.x * slope.x + slope.y * slope.y);
    // normalize slope
    slope = { x: slope.x / length, y: slope.y / length };
    // perpendicular:
    context.beginPath();
    context.moveTo(this.destPoint.x, this.destPoint.y);
    context.lineTo(this.destPoint.x - 15 * slope.x - 5 * slope.y, this.destPoint.y - 15 * slope.y + 5 * slope.x);
    context.lineTo(this.destPoint.x - 9 * slope.x, this.destPoint.y - 9 * slope.y);
    context.lineTo(this.destPoint.x - 15 * slope.x + 5 * slope.y, this.destPoint.y - 15 * slope.y - 5 * slope.x);
    context.fill();
  }

  /**
   * Update the position of the Label for a self-loop edge.
   * @param {Object} oldBezierPoint - The previous bezier point location.
   * @param {number} oldBezierPoint.x - The x-coordinate of the bezier point.
   * @param {number} oldBezierPoint.y - The y-coordinate of the bezier point.
   */
  updateSelfLoopLabel(oldBezierPoint) {
    this.label.x += this.bezierPoint.x - oldBezierPoint.x;
    this.label.y += this.bezierPoint.y - oldBezierPoint.y;
  }

  /**
   * Update the position of the Label for a straight edge.
   * @param  {Point2D} oldStartPoint2D - The previous start point.
   * @param  {Point2D} oldBezierPoint2D - The previous bezier point.
   * @param  {Point2D} oldDestPoint2D - The previous destination point.
   * @param  {Point2D} startPoint2D - The current start point.
   * @param  {Point2D} bezierPoint2D - The current bezier point.
   * @param  {Point2D} destPoint2D - The current destination point.
   */
  updateStraightEdgeLabel(oldStartPoint2D, oldBezierPoint2D, oldDestPoint2D, startPoint2D, bezierPoint2D, destPoint2D) {
    let oldLabelPosition = new Point2D(this.label.x, this.label.y);
    let oldStartLabelVec = oldStartPoint2D.vectorTo(oldLabelPosition);
    let oldStartDestVec = oldStartPoint2D.vectorTo(oldDestPoint2D);

    let u = oldStartLabelVec.projectOnto(oldStartDestVec);
    let v = oldStartLabelVec.sub(u);

    let ratioU = u.length / oldStartDestVec.length;
    if (u.degreesTo(oldStartDestVec) !== 0) {
      ratioU *= -1;
    }

    let startDestVec = startPoint2D.vectorTo(destPoint2D);
    let newU = startDestVec.scale(ratioU);

    let newLabelPosition;
    if (v.length === 0) {
      // label is on the line
      newLabelPosition = startPoint2D.translateVec(newU);
    } else {
      // label is not on the line
      let ratioV = v.length / oldStartDestVec.length;
      let angle = oldStartDestVec.degreesTo(v);
      let newV = startDestVec.rotateDegrees(angle).scale(ratioV);

      newLabelPosition = startPoint2D.translateVec(newU).translateVec(newV);
    }

    this.label.x = newLabelPosition.x;
    this.label.y = newLabelPosition.y;
  }

  /**
   * Update the position of the Label for a curved edge.
   * @param  {Point2D} oldStartPoint2D - The previous start point.
   * @param  {Point2D} oldBezierPoint2D - The previous bezier point.
   * @param  {Point2D} oldDestPoint2D - The previous destination point.
   * @param  {Point2D} startPoint2D - The current start point.
   * @param  {Point2D} bezierPoint2D - The current bezier point.
   * @param  {Point2D} destPoint2D - The current destination point.
   */
  updateCurvedEdgeLabel(oldStartPoint2D, oldBezierPoint2D, oldDestPoint2D, startPoint2D, bezierPoint2D, destPoint2D) {
    let oldTriangle = new Triangle2D(oldStartPoint2D, oldBezierPoint2D, oldDestPoint2D);
    let newTriangle = new Triangle2D(startPoint2D, bezierPoint2D, destPoint2D);

    let oldLabelPosition = new Point2D(this.label.x, this.label.y);
    let newLabelPosition = oldLabelPosition.relativePositionToTriangle2D(oldTriangle, newTriangle);

    this.label.x = newLabelPosition.x;
    this.label.y = newLabelPosition.y;
  }

}

export { Edge };
export default Edge;
