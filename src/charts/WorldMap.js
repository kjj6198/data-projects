import { prop, path } from 'ramda'; 
import * as d3 from 'd3';
import { attrs } from '../utils/d3Utils';

export default class WorldMap {
  constructor(url, target) {
    this.url = url;
    this.target = target;
  }

  setProjection(projection) {
    this.projection = projection;
    return this;
  }

  drawCountriesName(options = {}, countryAccessor) {
    if (this.map) {
      this.map
        .append('text')
        .call(attrs({
          class: 'country-label',
          transform: d => `translate(${this.path.centroid(d)})`,
        }))
        .text(countryAccessor || path(['properties', 'name']))
        .call(attrs({
          fill: options.fill || 'black',
          'font-size': prop('font-size', options) || '10px',
        }))
        .call(s => {
          const widths = s.nodes().map(node => node.getBBox().width);
          const heights = s.nodes().map(node => node.getBBox().height);
          s
            .attr('dx', (d, i) => (-widths[i] / 2))
            .attr('dy', (d, i) => (-heights[i] / 2));
        });
    }
  }

  draw(options = {}) {
    d3.json(this.url, data => {
      const path = d3.geoPath().projection(this.projection);
      this.path = path;
      this.map = d3
        .select(this.target)
        .call(attrs({
          width: window.innerWidth,
          height: window.innerHeight,
          fill: '#fe2121',
        }))
        .selectAll('path')
        .data(data.features)
        .enter();

      this.map
        .append('path')
        .call(attrs({
          'stroke-width': options.strokeWidth || prop('stroke-width', options) || 2,
          stroke: options.stroke || '#fe6565',
          fill: options.fill || 'none',
          d: path,
        }));
      
      if (options.text) {
        this.drawCountriesName();
      }
    });
  }
}