// // Immediately Invoked Function Expression to limit access to our 
// // variables and prevent 
// ((() => {

//   console.log("Hello, world!");

// })());

var width = 960;
var height = 500;
const MAP_BG_COLOR = "#cdc597";

var svg = d3
  .select("#map-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var projection = d3
  .geoAlbersUsa()
  .translate([width / 2, height / 2])
  .scale(width);

var path = d3.geoPath().projection(projection);

d3.json("us.json", function(err, us) {
  //console.log('err->>', err);
  //console.log('us-->', us)
  var mapGroup = svg.append("g").attr("class", "mapGroup");

  mapGroup
    .append("g")
    // .attr("id", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "states")
    .style("fill", MAP_BG_COLOR);


});