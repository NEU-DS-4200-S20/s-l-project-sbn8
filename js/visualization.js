var width = 960/2;
var height = 500/2;
const MAP_BG_COLOR = "#cdc597";



//For the Map
var svg = d3
  .select("#map-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);


//barchart age
var svg_age = d3
  .select("#chart-container-age")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

//barchart race
var svg_race = d3
  .select("#chart-container-race")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

//barchart income
var svg_income = d3
  .select("#chart-container-income")
  .append("svg")
  .attr("width", width)
  .attr("height", height);



// create projection for coordinates on map
var projection = d3
  .geoAlbersUsa()
  .translate([width / 2, height / 2])
  .scale(width);


var citiesobj;
var x_age;
var y_age;
var x_race;
var y_race;

var path = d3.geoPath().projection(projection);
d3.json("us.json", function(err, us) {
  d3.csv("data/SBNFoodFestivalAttendee2019Data.csv", function(cities) {
    citiesobj  = cities

    //Map Zipcode Data
    drawMap(us, cities);

    // Age barchart
    drawAge(cities); 

    // Race barchart
    drawRace(cities);
  });
});


var brush = d3.brush().on("start brush", highlight).on("end", brushend);

function drawAge(cities) {
  // set the dimensions and margins of the graph
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = 960/2 - margin.left - margin.right,
	    height = 500/2 - margin.top - margin.bottom;

	// set the ranges
	x_age = d3.scaleBand()
	          .range([0, width])
	          .padding(0.1);
	y_age = d3.scaleLinear()
	          .range([height, 0]);

	// append the svg object to the body of the page
	// append a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	var svg = svg_age.append("g")
      .attr("class", "svg age")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
    .attr("id", "chartcontainer")
	    .attr("transform", 
	          "translate(" + margin.left + "," + margin.top + ")");
	console.log(citiesobj);

	var freq = {
    "Under 18": 0,
    "19-25": 0,
    "26-35": 0,
    "36-50": 0,
    "51-64": 0,
    "65+": 0
  }

	// get frequencies of age ranges
	// console.log(cities)
	 for (row in cities){
	 	// console.log(cities[row]["What is your age range?"]);
	 	agerange = cities[row]["What is your age range?"]
	 	if (freq[agerange] == undefined) {
	 		if (agerange != "" && agerange != undefined) {
	 			freq[agerange] = 1
	 		}
	 	} 
	 	else {
	 		freq[agerange] += 1
	 	}
	 }

	 // console.log(freq)

	 // convert freq to list of objects, category -> size
	 // var dict = { 'a': 'aa', 'b': 'bb' };
	 var arr = [];

	 for (var key in freq) {
	     if (freq.hasOwnProperty(key)) {
	         arr.push( { range: key, frequency: freq[key] }  );
	     }
	 }
	 console.log(arr);


	 // Scale the range of the data in the domains
	  x_age.domain(arr.map(function(d) { return d.range; }));
	  y_age.domain([0, d3.max(arr, function(d) { return d.frequency; })]);


	 // append the rectangles for the bar chart
	  svg.selectAll(".bar")
	      .data(arr)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x_age(d.range); })
	      .attr("width", x_age.bandwidth())
	      .attr("y", function(d) { return y_age(d.frequency); })
	      .attr("height", function(d) { return height - y_age(d.frequency); });


	 // add the x Axis
	svg.append("g")
	      .attr("transform", "translate(0," + height + ")")
	      .call(d3.axisBottom(x_age));

	  // add the y Axis
	  svg.append("g")
	      .call(d3.axisLeft(y_age));

	
}

function drawRace(cities) {
  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 960/2 - margin.left - margin.right,
      height = 500/2 - margin.top - margin.bottom;

   
  // set the ranges   
  x_race = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
  y_race = d3.scaleLinear()
            .range([height, 0]);

  var svg2 = svg_race.append("g")
      .attr("class", "svg race")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("id", "chartcontainer2")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");
  console.log(cities);

  // only need to put values dict is you want to order them
  var freq = {
    // "Hispanic/Latino": 0,
    // "American Indian or Alaskan Native": 0,
    // "White/Caucasian": 0,
    // "Asian": 0,
    //
  }


  // get frequencies of race groups
  // console.log(cities)
   for (row in cities){
    // console.log(cities[row]["What is your age range?"]);
    race = cities[row]["Race"]//.substring(0,4);
    // console.log(typeof race);
    // if (race != "" && race != undefined) {
    //   race = race.substring(0,4);
    // }
    
    console.log(race);
    if (freq[race] == undefined) {
      if (race != "" && race != undefined) {
        freq[race] = 1
      }
    } 
    else {
      freq[race] += 1
    }
   }

   var arr = [];

   for (var key in freq) {
       if (freq.hasOwnProperty(key)) {
           arr.push( { range: key, frequency: freq[key] }  );
       }
   }
   console.log(arr);


  // Scale the range of the data in the domains
  x_race.domain(arr.map(function(d) { return d.range; }));
  y_race.domain([0, d3.max(arr, function(d) { return d.frequency; })]);



   // append the rectangles for the bar chart
    svg2.selectAll(".bar")
        .data(arr)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x_race(d.range); })
        .attr("width", x_race.bandwidth())
        .attr("y", function(d) { return y_race(d.frequency); })
        .attr("height", function(d) { return height - y_race(d.frequency); });



  // add the x Axis
  svg2.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x_race))
        // .style("font-size", "6px");

  // add the y Axis
  svg2.append("g")
      .call(d3.axisLeft(y_race));
}


function drawMap(us, cities) {
  var mapGroup = svg.append("g").attr("class", "mapGroup");

  svg.call(d3.zoom().on("zoom", function () {
       mapGroup.attr("transform", d3.event.transform)
       svg.attr("translate", d3.event.translate)
       mapGroup.selectAll("circle")
                .attr("r", function(d) {
                     if (d3.event && d3.event.transform.k) {
                        return 4/d3.event.transform.k;
                     }
                     else {
                      return 4;
                     }})
    }))
  .append("g");

  // draw the background map
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

  // draw each point on the map
  var circles = mapGroup.selectAll('circle')
                   .data(cities)
                   .enter()
                   .append("circle")
                   .attr('class', 'cities')
                   .attr('cx', function(d) {
                      if (!projection([d.Lon, d.Lat])) {
                       return;
                      }
                     return projection([d.Lon, d.Lat])[0];
                   })
                   .attr('cy', function(d) {
                      if (!projection([d.Lon, d.Lat])) {
                       return;
                      }
                    return projection([d.Lon, d.Lat])[1];
                   })
                   .attr("r", 4)
                   .attr("agerange", function(d) {
                      return d["What is your age range?"];
                   });
    mapGroup.append("g").call(brush);
}

// Enable selection of group of points on map
function highlight() {
  if (d3.event.selection === null) return;

  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960/2 - margin.left - margin.right,
    height = 500/2 - margin.top - margin.bottom;

  let [[x0, y0], [x1, y1]] = d3.event.selection;

  circles = d3.selectAll("circle");
  circles.classed(
      'selected', 
      d =>
          projection([d.Lon, d.Lat]) &&
          x0 <= projection([d.Lon, d.Lat])[0] &&
          projection([d.Lon, d.Lat])[0] <= x1 &&
          y0 <= projection([d.Lon, d.Lat])[1] &&
          projection([d.Lon, d.Lat])[1] <= y1 
           
  );
  // console.log(circles);
  // print(citiesobj);



  d3.selectAll("g.highlighted")
    .remove();

  // 341 - 386 is for brushing for age barchart
  var freq = {}

  var selected = d3.selectAll(".selected")
                    .each(function(d) {
                      var agerange = d["What is your age range?"]

                      if (agerange != "") {

                        if (freq[agerange]) {
                          freq[agerange] += 1
                          // console.log(freq[agerange]);

                        }
                        else {
                          freq[agerange] = 1

                        }
                      }

                      // console.log(freq);
  });

   // convert freq to list of objects, category -> size
   // var dict = { 'a': 'aa', 'b': 'bb' };
   var arr = [];

   for (var key in freq) {
       if (freq.hasOwnProperty(key)) {
           arr.push( { range: key, frequency: freq[key] }  );
       }
   }
   // console.log(freq);

  // add new red rectangles over the bar chart, indicating selected
  d3.select("#chartcontainer")
    .append("g")
      .attr("class", "highlighted")
      .selectAll(".barx")
        .data(arr)
      .enter().append("rect")
        .attr("class", "barx")
        .attr("x", function(d) { return x_age(d.range); })
        .attr("width", x_age.bandwidth())
        .attr("y", function(d) { return y_age(d.frequency); })
        .attr("height", function(d) { return height - y_age(d.frequency); })
        .attr("fill", "red");

// brushing for age starts here

var freq_race = {}

var selected_race = d3.selectAll(".selected")
                    .each(function(d) {
                      var agerange = d["Race"]

                      if (agerange != "") {

                        if (freq_race[agerange]) {
                          freq_race[agerange] += 1
                          // console.log(freq[agerange]);

                        }
                        else {
                          freq_race[agerange] = 1

                        }
                      }

  }); 

// convert freq to list of objects, category -> size
// var dict = { 'a': 'aa', 'b': 'bb' };
var arr2 = [];  //reuse same arr variable from above

for (var key in freq_race) {
   if (freq_race.hasOwnProperty(key)) {
       arr2.push( { range: key, frequency: freq_race[key] }  );
   }
}
console.log(arr2);

// add new red rectangles over the bar chart, indicating selected
d3.select("#chartcontainer2")
  .append("g")
    .attr("class", "highlighted")
    .selectAll(".barx")
      .data(arr2)
    .enter().append("rect")
      .attr("class", "barx")
      .attr("x", function(d) { return x_race(d.range); })
      .attr("width", x_race.bandwidth())
      .attr("y", function(d) { return y_race(d.frequency); })
      .attr("height", function(d) { return height - y_race(d.frequency); })
      .attr("fill", "red");

// brushing for income here

}
function brushend() {
}