// // dimensions and margins
// // reference: https://www.d3-graph-gallery.com/graph/lollipop_basic.html
var margins = {top: 30, right: 0, bottom: 30, left: 50},
    width = 460 - margins.left - margins.right,
    height = 400 - margins.top - margins.bottom;

//append svg object to body on page
var svg = d3.select("#area")
    .append("svg")
    .attr("width", width + margins.left + margins.right)
    .attr("height", height + margins.top + margins.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margins.left + "," + margins.top + ")");

// read in data from jsons
d3.json('./data/census2009.json').then(data09 => {
    console.log(data09);

//x axis
var x = d3.scaleBand()
    .range([0, width])
    .domain(data09.map(function(d) {return d.county_name}))
    .padding(1);
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
        .attr("transfrom", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

//add y axis
var y = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);
svg.append("g")
    .call(d3.axisLeft(y));

//Lines
svg.selectAll("myline")
    .data(data09)
    .enter()
    .append("line")
        .attr("x1", function(d) {return x(d.county_name);})
        .attr("x2", function(d) {return x(d.county_name);})
        .attr("y1", function(d) {return y(d.nonwhite_pct);})
        .attr("y2", y(0))
        .attr("stroke", "gray")

// circles
svg.selectAll("mycircle")
    .data(data09)
    .enter()
    .append("circle")
        .attr("cx", function(d) {return x(d.county_name);})
        .attr("cy", function(d) {return y(d.nonwhite_pct);})
        .attr("r", "4")
        .style("fill", "#69b3a2")
        .attr("stroke", "black")
});

var table = d3.select("table");

// event listeners for filter button
var inputFieldState = d3.select("#state");
var button = d3.select("#filter-btn");

button.on("click", () => {
    //prevent refreshing page
    d3.event.preventDefault();

    var inputState = inputFieldState.property("value");
    let stateFilter = data09.filter(data09 => data09.state == inputState);
    console.log(inputState);
    console.log(stateFilter);

    //remove data that doesn't match
    table.html("")
    
});