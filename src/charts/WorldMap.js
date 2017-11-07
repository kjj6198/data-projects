import { prop, path, pathOr, identity } from 'ramda'; 
import * as d3 from 'd3';
import { attrs,  } from '../utils/d3Utils';

export default class WorldMap {
  constructor(url, target) {
    this.url = url;
    this.target = target;
    this._hasDrawn = false;
    return this;
  }

  /**
   * @param {d3.GeoProjection} projection
   * @return this
   */
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

  on(event, listener, capture) {
    this.map.on(event, listener, capture);

    return this;
  }

  update() {
    if (!this._hasDrawn) {
      throw new Error('you can not update a map which hasn\'t drawn yet.');
    }
    const update = this.map
      .data(this.data);

    update.exit().remove();
  }

  setData(data) {
    if (data !== this.data) {
      this.data = data;
      this.update();
    }
  }

  draw(options = {}) {
    d3.json(this.url, data => {
      const pathFn = d3.geoPath().projection(this.projection);
      this.data = data;
      this.path = pathFn;
      this.map = d3
        .select(this.target)
        .call(attrs({
          width: window.innerWidth,
          height: window.innerHeight,
          fill: '#fe2121',
        }))
        .selectAll('path')
        .data(data.features, pathOr(['properties', 'name'], identity))
        .enter();

      this.map
        .append('path')
        .call(attrs({
          'stroke-width': options.strokeWidth || prop('stroke-width', options) || 2,
          stroke: options.stroke || '#fe6565',
          fill: options.fill || 'none',
          d: pathFn,
        }));
      
      if (options.text) {
        this.drawCountriesName();
      }
    });
  }
}
