import { axisRight, axisLeft, axisTop, axisBottom } from 'd3'
import { generateSVG } from '../utils/d3Utils';

function getAxisFn(direction) {
  switch (direction) {
    case 'left':
      return axisLeft;
    case 'right':
      return axisRight;
    case 'top':
      return axisTop;
    case 'bottom':
      return axisBottom;
    default:
      throw new TypeError(`expected \`left\` or \`right\` or \`top\` or \`bottom\`, but get ${direction}`);
  }
}

export default class BaseChart {
  constructor(options = {}) {
    this.xScale = options.xScale;
    this.yScale = options.yScale;
    this.width = options.width;
    this.height = options.height;
    this.margin = options.margin;

    this.generateSVG(options.target);
  }

  generateSVG(target) {
    this.svg = generateSVG(target, this.width, this.height, this.margin);
    return this;
  }

  setAxisX(options) {
    const { direction = 'bottom', ticks = 10, tickSize = 10, xScale = this.xScale } = options;
    this.svg
      .attr('class', 'x axis')
      .append('g')
      .attr('transform', `translate(0, ${this.height})`)
      .call(
        getAxisFn(direction)(xScale)
          .ticks(ticks)
          .tickSize(tickSize)
      );
    return this;
  }

  setAxisY(options) {
    const { direction = 'left', ticks, tickSize, yScale = this.yScale } = options;
    this.svg
      .attr('class', 'x axis')
      .append('g')
      .call(
        getAxisFn(direction)(yScale)
          .ticks(ticks)
          .tickSize(tickSize)
      );
    return this;
  }
}
