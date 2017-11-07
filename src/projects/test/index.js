import * as d3 from 'd3';
import { generateSVG, generateAxis, attrs } from '@/d3Utils';
import * as R from 'ramda';

const margin = {
  top: 80,
  bottom: 40,
  right: 40,
  left: 80,
}
window.d3 = d3;
const width = window.innerWidth - margin.left - margin.right;
const height = 500 - margin.left - margin.right;

const populations = {
  千代田区: 59737,
  中央区: 149073,
  港区: 248621,
  新宿区: 339724,
  文京区: 223691,
  台東区: 200635,
  墨田区: 260569,
  江東区: 503888,
  品川区: 392849,
  目黒区: 279929,

  大田区: 722377,
  世田谷区: 914148,
  渋谷区: 227268,
  中野区: 332522,
  杉並区: 570302,

  豊島区: 295246,
  北区: 345666,
  荒川区: 214742,
  板橋区: 569654,
  練馬区: 726928,

  足立区: 673348,
  葛飾区: 447316,
  江戸川区: 687232,

  八王子市: 577960,
  立川市: 178286,
  武蔵野市: 145443,
  三鷹市: 189158,
  青梅市: 136527,

  府中市: 261175,
  昭島市: 111447,
  調布市: 232656,
  町田市: 433921,
  小金井市: 122904,

  小平市: 191451,
  日野市: 187249,
  東村山市: 149901,
  国分寺市: 123484,
  国立市: 74339,

  福生市: 58380,
  狛江市: 81376,
  東大和市: 84891,
  清瀬市: 75042,
  東久留米市: 116397,

  武蔵村山市: 71400,
  多摩市: 147260,
  稲城市: 89399,
  羽村市: 55599,
  あきる野市: 80791,

  西東京市: 200933,

  瑞穂町: 33286,
  日の出町: 17460,
  檜原村: 2135,
  奥多摩町: 5095,
};

// function drawBarChart(data, ) {

//   console.log(height)

//   const xScale = d3
//     .scaleBand()
//     .padding(0.45)
//     .domain(data.map(R.prop('name')))
//     .range([0, width]);

//   const yScale = d3
//     .scaleLinear()
//     .domain([0, 100])
//     .range([height, 0]);


//   const axis = generateAxis(xScale, yScale, '%', 10, 10);
//   axis(svg, width, height);
//   // debugger;
//   const t = d3.transition().duration(1000);

//   d3.select(svg.node())
//     .selectAll('rect')
//     .data(data)
//     .enter()
//     .append('rect')
//     .call(attrs({
//       y: height,
//       height: 0,
//       x: d => xScale(d.name),
//       width: xScale.bandwidth,
//     }))
//     .transition(t)
//     .attr('y', R.pipe(R.prop('math'), yScale))
//     .attr('height', d => height - yScale(d.math));
// }

// const data = [
//   { name: 'Alice', math: 37,   science: 62,   language: 54 },
//   { name: 'Billy', math: null, science: 34,   language: 85 },
//   { name: 'Cindy', math: 86,   science: 48,   language: null },
//   { name: 'David', math: 44,   science: null, language: 65 },
//   { name: 'Emily', math: 59,   science: 73,   language: 29 },
// ];

// drawBarChart(data);

d3.json('../fixtures/tokyo.geojson', data => {
  // console.log(data);
  const projection = d3
    .geoMercator()
    .translate([width / 1.8, height * 2])
    .center([139.46, 35.42])
    .scale(70000);
  const path = d3.geoPath().projection(projection);

  /* 1. set basic data structure. */
  const map = d3.select('div')
    .append('svg')
    .call(attrs({
      width: window.innerWidth,
      height: window.innerHeight,
      fill: '#fe2121',
    }))
    .selectAll('path')
    .data(data.features)
    .enter();

  const color = d3.scaleLinear()
    .domain([1, 1000000])
    .interpolate(d3.interpolateHcl)
    .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')])

  // 2. add path
  map
    .append('path')
    .on('click', function() {
      d3.select(this)
        .attr('stroke-width', '3')
    })
    .attr('d', path)
    .call(attrs({
      'stroke-width': '1',
      stroke: '#000',
      fill: R.compose(
        color,
        (name) => R.prop(name)(populations),
        R.path(['properties', 'ward_ja']),
      ),
    }));

  // 3. add text
  map
    .append('text')
    .call(attrs({
      class: 'country-label',
      transform: d => `translate(${path.centroid(d)})`,
    }))
    .text(R.path(['properties', 'ward_ja']))
    .call(attrs({
      fill: 'black',
      'font-size': '10px',
    }))
    .call(s => {
      const widths = s.nodes().map(node => node.getBBox().width);
      const heights = s.nodes().map(node => node.getBBox().height);
      s
        .attr('dx', (d, i) => (-widths[i] / 2))
        .attr('dy', (d, i) => (-heights[i] / 2 + 4));
    })

});
