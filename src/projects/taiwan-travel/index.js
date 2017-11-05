import * as d3 from 'd3';
import * as R from 'ramda';
import { generateSVG, generateAxis } from '../../utils/d3Utils';

window.d3 = d3;

function draw(data) {
  console.table(data);
  window.data = data;
  data.forEach((d, i) => {
    data[i].values = Object
      .keys(d.values[0])
      .map(key => ({
        key,
        value: d[key]
      }));
  });
  const svg = generateSVG('#taiwan-travler', window.innerWidth / 2, 350, {
    left: 40,
    top: 10,
    bottom: 30,
    right: 20,
  });

  const xScale = d3
    .scaleLinear()
    .domain([2010, 2016])
    .range([0, 500]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(
      data,
      d => d['2016'].split(',').join('')
    ))
    .range([350, 0]);

  svg
    .classed('x-axis', true)
    .append('g')
    .attr('transform', `translate(0, 350)`)
    .call(d3.axisBottom(xScale).ticks(6).tickFormat(d3.format('d')));

  svg
    .append('g')
    .classed('y-axis', true)
    .call(d3.axisLeft(yScale).tickSizeInner(40));

  const line = d3.line()
    .x(d => xScale(d))
}

d3.csv('./data/taiwan-traveler.csv', draw, d => d3.nest().key(data => data[d.columns[0]]).entries);
