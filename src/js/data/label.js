/**
 * Data representation of text objects. Not called Text due to JavaScript already having a Text class.
 * @class Label
 */
class Label {

  // graph data
  x;
  y;
  parentObject;
  content = '';

  // state
  isSelected = false;
  textMetric;

  // appearance
  color = '#000000';
  selectedColor = '#ff0000';
  textAlign = 'start';

  // context.font properties
  // https://developer.mozilla.org/en-US/docs/Web/CSS/font
  // font = size | family
  //      = style | size | family
  //      = style | variant | weight | size/line-height | family
  //      = style | variant | weight | stretch | size/line-height | family
  fontStyle = 'normal'; // normal | italic | oblique
  fontVariant = 'normal'; // normal | small-caps
  fontWeight = 'normal'; // normal | bold | lighter | bolder | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  fontStretch = 'normal'; // normal | semi-condensed | condensed | extra-condensed | ultra-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded
  fontSize = '14px'; // xx-small | x-small | small | medium | large | x-large | xx-large | larger | smaller | <length> | <percentage>
  lineHeight = 'normal'; // normal | <number> | <length> | <percentage>
  fontFamily = 'Open sans'; // <family-name> | <generic-name>
  // <length> units
  // https://developer.mozilla.org/en-US/docs/Web/CSS/length

  /**
   * Constructs a Label instance.
   * @param  {number} x - x-coordinate of the label.
   * @param  {number} y - y-coordinate of the label.
   * @param  {(Node|Edge)} parentObject - Node or Edge associated with the Label.
   * @constructs Label
   */
  constructor(x, y, parentObject) {
    this.x = x;
    this.y = y;
    this.parentObject = parentObject;
  }

  /**
   * Check if the label contains the given point.
   * @param  {number} x - x-coordinate of the point.
   * @param  {number} y - y-coordinate of the point.
   * @return {boolean} - Whether or not the label contains the point.
   */
  containsPoint(x, y) {
    if (this.content === '') {
      return false;
    }
    // textMetric.actualBoundingBox* not yet supported in stable Chrome
    let padding = 5;
    let left = this.x - padding;
    let right = this.x + this.textMetric.width + padding;

    let top = this.y - parseInt(this.fontSize, 10) - padding;
    let bottom = this.y + padding;

    let containsPoint = (left <= x && x <= right) && (top <= y && y <= bottom);
    return containsPoint;
  }

  /**
   * Returns the font properties concatenated to match the CanvasRenderingContext2D.font property.
   * @return {string} - String that can be used to set the canvas font property.
   */
  get font() {
    return `${this.fontStyle} ${this.fontVariant} ${this.fontWeight} ${this.fontStretch} ${this.fontSize}/${this.lineHeight} "${this.fontFamily}", sans-serif`;
  }

  /**
   * Update the label's position.
   * @param {number} x - The new x-coordinate.
   * @param {number} y - The new y-coordinate.
   */
  setPos(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Draw the label on the given canvas context.
   * @param  {CanvasRenderingContext2D} context - Canvas 2D context.
   */
  draw(context) {
    if (this.content === '') {
      return;
    }

    this.textMetric = context.measureText(this.content);

    // set font style
    context.font = this.font;
    context.textAlign = this.textAlign;
    context.fillStyle = this.color;

    context.fillText(this.content, this.x, this.y);

    if (this.isSelected) {
      this.drawBox(context);
    }
  }

  /**
   * Draw a box around the label's selection area on the given canvas context.
   * @param  {CanvasRenderingContext2D} context - Canvas 2D context.
   */
  drawBox(context) {
    // textMetric.actualBoundingBox* not yet supported in stable Chrome
    let padding = 5;
    let left = this.x - padding;
    let right = this.x + this.textMetric.width + padding;

    let top = this.y - parseInt(this.fontSize, 10) - padding;
    let bottom = this.y + padding;

    context.strokeStyle = this.selectedColor;

    context.beginPath();
    context.moveTo(left, top);
    context.lineTo(left, bottom);
    context.lineTo(right, bottom);
    context.lineTo(right, top);
    context.lineTo(left, top);
    context.stroke();
  }
}

export { Label };
export default Label;
