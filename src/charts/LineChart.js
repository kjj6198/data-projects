import BaseChart from './BaseChart';
import * as d3 from 'd3';
import { attrs, styles } from '../utils/d3Utils';

export default class LineChart extends BaseChart {
  constructor(options) {
    super(options);
    this.name = options.name;
    this.data = options.data;
    this.line = options.line || d3.line();
    this.type = options.type || 'line';

    this.svg.attr('id', options.name);
  }

  update(data, options) {
    const t = options.transition || d3.transition().duration(1000);

    this.xScale = options.xScale;
    this.yScale = options.yScale;
    const yAxis = this.svg.select('.y.axis');
    yAxis
      .transition(t)
      .delay(1000)
      .call(s => this.setAxisY({
        yScale: this.yScale || options.yScale,
      }));

    const update = this.svg.selectAll('.line-chart > path')
      .data(data, options.bindFn || undefined);

    update.exit()
      .transition(t)
      .delay(1000)
      .attr('d', d => this.line(options.handleFn || d));

    return this;
  }

  draw(data = null, options) {
    const paths = this.svg
      .append('g')
      .attr('class', 'line-chart')
      .selectAll('.line')
      .data(data || this.data);

    paths
      .append('path')
      .call(attrs({
        class: 'line',
        d: d => options.d(d) || this.line(d),
        stroke: options.stroke || ((d, i) => d3.schemeCategory20b[i % 20]),
        fill: 'none',
        'stroke-width': options.strokeWidth || options['stroke-width'] || 2,
      }));

    return this;
  }
}
