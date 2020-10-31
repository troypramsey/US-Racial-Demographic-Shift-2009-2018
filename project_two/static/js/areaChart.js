// DROPDOWN
// Values for building dropdown
let years = [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018]

// D3 to build dropdown
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


