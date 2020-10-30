// purpose of this js file is to use plotly to make static graphs / charts of the data
d3.json('./data/census2009.json').then(counties => {
    // window.buttonData = buttonData;
    console.log(counties);
});

// set dimentions and margins
// reference for area plot: https://www.d3-graph-gallery.com/graph/area_basic.html
let height = 800, width = 1000
let margin = {top: 0, left: 0, right: 0, bottom: 0}

//Build dropdown menu start
//values for dropdown
let years = [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018]

//default year upon loading
let defaultOption = 2009

//d3 to build dropdown
let dropdown = d3.select('#dropdown-container')
    .append('select')
    .classed('form-control form-control-lg', true)
    .attr('id', 'dropdown')

// D3 to build selection for each year
let selections = dropdown.selectAll('option')
    .data(years)
    .join('option')
    .attr('value', d => d)
    .attr('class', 'year')
    .text(d => d)
//D3 to build selection for states
let 