// purpose of this js file is to use plotly to make static graphs / charts of the data
d3.json('./data/census2009.json').then(counties => {
    // window.buttonData = buttonData;
    console.log(counties);
});

// set dimentions and margins
// reference for area plot: https://www.d3-graph-gallery.com/graph/area_basic.html
var margin = {top: 10, right: 30, bottom: 30, left: 50},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object
var svg = d3.select("#area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top +")");

