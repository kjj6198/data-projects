import * as d3 from 'd3';

export const attrs = (options = {}) => s =>
  Object
    .keys(options)
    .forEach(key => s.attr(key, options[key]));

export const styles = (options = {}) => s =>
  Object
    .keys(options)
    .forEach(key => s.style(key, options[key]));


export function responsivefy(svg) {
  const container = d3.select(svg.node().parentNode);
  const width = parseInt(svg.style('width'), 10);
  const height = parseInt(svg.style('height'), 10);
  const aspect = width / height;

  function resize() {
    const targetWidth = parseInt(container.style('width'), 10);
    svg.attr('width', targetWidth);
    svg.attr('height', Math.round(targetWidth / aspect));
  }

  svg
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMinYMid')
    .call(resize);

  d3.select(window).on(`resize.${container.attr('id')}`, resize);
}

/**
 *
 * @param {string} target DOM selector
 * @param {number} width
 * @param {number} height
 * @param {object} margin
 */
export const generateSVG = (target, width, height, margin = {
  top: 10,
  bottom: 10,
  left: 30,
  right: 10,
}) =>
  d3
    .select(target)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    // .call(responsivefy)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

/**
 *
 * @param {d3.ScaleBand | d3.ScaleLinear} xScale X scale
 * @param {d3.ScaleBand | d3.ScaleLinear} yScale Y scale
 * @param {object | string} label
 * @param {number} xTicks
 * @param {number} yTicks
 */
export function generateAxis(xScale, yScale, label = {}, xTicks = 10, yTicks = 15) {
  return (svg, width, height) => {
    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .attr('class', 'x axis')
      .call(d3.axisBottom(xScale).ticks(xTicks).tickSize(10));
    svg.selectAll('.x.axis text')
      .attr('y', 15);

    svg
      .append('g')
      .attr('class', 'y axis')
      .call(d3.axisLeft(yScale).ticks(yTicks).tickSize(-width))
      .append('text')
      .attr('dx', 4)
      .attr('y', 6)
      .attr('text-anchor', 'start')
      .text(label)
      .style('fill', '#111')
      .style('font-size', '20px')
      .style('font-weight', 'bold');
  };
}

export function generateAxisX(xScale, options = {}) {
  return (svg, callback) => {
    const axisX = svg
      .append('g')
      .attr('transform', `translate(0, ${options.height || 350})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(options.ticks || 6)
          .tickFormat(options.tickFormat || d3.format('d'))
      );

    if (options.attrs) {
      axisX.call(attrs(options.attrs));
    }

    if (options.className) {
      axisX.selectAll('g').classed(options.className, true);
    }

    if (callback && typeof callback === 'function') {
      callback.call(svg, axisX);
    }
  };
}
