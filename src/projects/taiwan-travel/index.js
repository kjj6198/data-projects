import * as d3 from 'd3';
import * as R from 'ramda';
import WorldMap from '../../charts/WorldMap';
import { generateSVG, generateAxis } from '../../utils/d3Utils';
import { toNumber } from '../../utils/utils';
import countries from '../../constants/countries';

window.d3 = d3;

function draw(data) {
  console.table(data);
  window.data = data;
  data.forEach((d, i) => {
    data[i].values = Object
      .keys(d.values[0])
      .map(key => ({
        key,
        value: d.values[0][key]
      }));
  });
  console.log(data);
  const svg = generateSVG('#taiwan-travler', window.innerWidth / 2, 350, {
    left: 50,
    top: 20,
    bottom: 30,
    right: 20,
  });

  const xScale = d3
    .scaleLinear()
    .domain([2002, 2016])
    .range([0, 500]);

  const yScale = d3
    .scaleSqrt()
    .domain([100, 5000000])
    .range([350, 0]);

  svg
    .classed('x-axis', true)
    .append('g')
    .attr('transform', `translate(0, 350)`)
    .call(d3.axisBottom(xScale).ticks(14).tickFormat(d3.format('d')));

  svg
    .append('g')
    .classed('y-axis', true)
    .call(d3.axisLeft(yScale).tickSizeInner(0));

  const line = d3.line()
    .x(d => xScale(+d.key))
    .y(d => yScale(
        parseInt(d.value.split(',').join('')) || 0
    ));


  const paths = svg
    .append('g')
    .selectAll('.line')
    .data(data)
    .enter();

  paths
    .append('path')
    .attr('class', 'line')
    .attr('d', d => line(d.values.filter(dd => dd.key !== '地區')))
    .style('stroke', (d, i) => d3.schemeCategory20b[i % 20])
    .style('fill', 'none')
    .style('stroke-width', 2);

  paths
  .append('text')
  .text(d => countries[d.key.split(' ')[1].toLowerCase()])
  .attr('x', d => xScale(2016))
  .attr('y', d => yScale(toNumber(d.values.filter(dd => dd.key !== '地區').slice(-1).pop().value)))
  .attr('font-size', '18px')
  .attr('opacity', 0.9)
  .call(onClick);

  function onClick(selection) {
    selection
      .on('click')
  }

  const map = new WorldMap('./data/world.geojson', '#travelerMap');
  map.projection = d3.geoMercator()
    .scale(190)
    .translate([window.innerWidth / 2, window.innerHeight / 2]);
  map.draw({ text: true });
}

d3.csv('./data/taiwan-traveler.csv', data => {
  draw(d3.nest().key(d => d[data.columns[0]]).entries(data))
});
