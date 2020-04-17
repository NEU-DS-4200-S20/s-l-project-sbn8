var width = 1000/2;
var height = 520/2;
const MAP_BG_COLOR = "#cdc597";
var legend_x = 400;
var legend_y = 10; 


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
var x_income;
var y_income;

var path = d3.geoPath().projection(projection);
d3.json("us.json", function(err, us) {
  d3.csv("data/SBNFoodFestivalAttendee2019Data.csv", function(cities) {
    console.log(cities)

    //Map Zipcode Data
    drawMap(us, cities);

    // Age barchart
    drawAge(cities); 

    // Race barchart
    drawRace(cities);

    // Income barchart
    drawIncome(cities);
  });
});


var brush = d3.brush().on("start brush", highlight).on("end", brushend);
var margin = {top: 20, right: 20, bottom: 60, left: 40},
      width = 1000/2 - margin.left - margin.right,
      height = 500/2 - margin.top - margin.bottom;


// barchart modelled after this example https://bl.ocks.org/d3noob/8952219
// some data preprocessing done here too
function drawAge(cities) {
  // set the dimensions and margins of the graph
	

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

	var freq = {
    "Under 18": 0,
    "19-25": 0,
    "26-35": 0,
    "36-50": 0,
    "51-64": 0,
    "65+": 0
  }

	// get frequencies of age ranges
	 for (row in cities){
	 	// console.log(cities[row]["What is your age range?"]);
	 	agerange = cities[row]["What is your age range?"]
    if (agerange == "65") {
      agerange = "65+";
    }
	 	if (freq[agerange] == undefined) {
	 		if (agerange != "" && agerange != undefined) {
	 			freq[agerange] = 1
	 		}
	 	} 
	 	else {
	 		freq[agerange] += 1
	 	}

	 }

	 // convert freq to list of objects, category -> size
	 // var dict = { 'a': 'aa', 'b': 'bb' };
	 var arr = [];

	 for (var key in freq) {
	     if (freq.hasOwnProperty(key)) {
	         arr.push( { range: key, frequency: freq[key] }  );
	     }
	 }


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

          
  // Handmade legend
  svg.append("circle").attr("cx",legend_x).attr("cy",legend_y).attr("r", 3).style("fill", "red")
  svg.append("circle").attr("cx",legend_x).attr("cy",legend_y + 9).attr("r", 3).style("fill", "steelblue")
  svg.append("text").attr("x", legend_x + 7).attr("y", legend_y).text("Selected").style("font-size", "9px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", legend_x + 7).attr("y", legend_y + 9).text("All").style("font-size", "9px").attr("alignment-baseline","middle")

}

// barchart modelled after this example https://bl.ocks.org/d3noob/8952219
// some data preprocessing done here too
function drawRace(cities) {
  // set the dimensions and margins of the graph
  // var margin = {top: 20, right: 20, bottom: 30, left: 40},
  //     width = 960/2 - margin.left - margin.right,
  //     height = 500/2 - margin.top - margin.bottom;

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

  // only need to put values dict is you want to order them
  // see freq in drawAge or drawIncome for example
  var freq = {}

  // get frequencies of race groups
  for (row in cities) {
    race = cities[row]["Race"]
    // fix naming to fit and to be cleaner looking
    switch(race) {
      case "White/Caucasian":
        race = "Caucasian"
        break;
      case "African American":
        race = "African Am."
        break;
      case "American Indian or Alaskan Native":
        race = "Native Am."
        break;
      default:
        // code block
    } 
    
    // sum frequencies
    if (freq[race] == undefined) {
      if (race != "" && race != undefined) {
        freq[race] = 1
      }
    } 
    else {
      freq[race] += 1
    }
   }

   // into needed object structure for bar chart
   var arr = [];

   for (var key in freq) {
       if (freq.hasOwnProperty(key)) {
           arr.push( { range: key, frequency: freq[key] }  );
       }
   }

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
  // labels are rotated here
  svg2.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x_race))
        .selectAll("text")  
        .style("text-anchor", "end")
        // .attr("dx", "-.8em")
        // .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

  // add the y Axis
  svg2.append("g")
      .call(d3.axisLeft(y_race));

    // Handmade legend
    svg2.append("circle").attr("cx", legend_x).attr("cy",legend_y).attr("r", 3).style("fill", "red")
    svg2.append("circle").attr("cx", legend_x).attr("cy",legend_y + 9).attr("r", 3).style("fill", "steelblue")
    svg2.append("text").attr("x",  legend_x + 7).attr("y", legend_y).text("Selected").style("font-size", "9px").attr("alignment-baseline","middle")
    svg2.append("text").attr("x",  legend_x + 7).attr("y", legend_y + 9).text("All").style("font-size", "9px").attr("alignment-baseline","middle")

}

// barchart modelled after this example https://bl.ocks.org/d3noob/8952219
// some data preprocessing done here too
function drawIncome(cities) {

  // set the ranges
  x_income = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
  y_income = d3.scaleLinear()
            .range([height, 0]);

  var svg3 = svg_income.append("g")
      .attr("class", "svg income")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("id", "chartcontainer3")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

  // only need to put values dict is you want to order them
  var freq = {
    "Less than $20,000": 0,
    "$20,000-34,999": 0,
    "$35,000-$49,000": 0,
    "$50,000-$74,999": 0,
    "75,000-$99,999": 0,
    "Over $100,000": 0
  }

  // get frequencies of race groups
  for (row in cities){
    income = cities[row]["Please indicate your household income"]

    // sum frequencies
    if (freq[income] == undefined) {
      if (income != "" && income != undefined) {
        freq[income] = 1
      }
    } 
    else {
      freq[income] += 1
    }
   }


   // into needed object structure for bar chart
   var arr = [];

   for (var key in freq) {
       if (freq.hasOwnProperty(key)) {
           arr.push( { range: key, frequency: freq[key] }  );
       }
   }


  // Scale the range of the data in the domains
  x_income.domain(arr.map(function(d) { return d.range; }));
  y_income.domain([0, d3.max(arr, function(d) { return d.frequency; })]);

  // append the rectangles for the bar chart
  svg3.selectAll(".bar")
      .data(arr)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x_income(d.range); })
      .attr("width", x_income.bandwidth())
      .attr("y", function(d) { return y_income(d.frequency); })
      .attr("height", function(d) { return height - y_income(d.frequency); });



  // add the x Axis
  // leaving in positional lines just in case it needs to be adjusted
  svg3.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x_income))
        .selectAll("text")
        .style("text-anchor", "end")
        // // .attr("dx", "-.8em")
        // // .attr("dy", ".15em")
        .attr("transform", "rotate(-35)");
        // .style("font-size", "6px");

  // add the y Axis
  svg3.append("g")
      .call(d3.axisLeft(y_income));

  // Handmade legend
  svg3.append("circle").attr("cx", legend_x).attr("cy",legend_y - 24).attr("r", 3).style("fill", "red")
  svg3.append("circle").attr("cx", legend_x).attr("cy",legend_y - 15).attr("r", 3).style("fill", "steelblue")
  svg3.append("text").attr("x",  legend_x + 7).attr("y", legend_y - 24).text("Selected").style("font-size", "9px").attr("alignment-baseline","middle")
  svg3.append("text").attr("x",  legend_x + 7).attr("y", legend_y - 15).text("All").style("font-size", "9px").attr("alignment-baseline","middle")


}


// most of this code was given to us in an example, simply adjusted for our project
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

  var margin = {top: 20, right: 20, bottom: 60, left: 40},
    width = 1000/2 - margin.left - margin.right,
    height = 500/2 - margin.top - margin.bottom;


  let [[x0, y0], [x1, y1]] = d3.event.selection;

  // if circles inside brush tool, they get class "selected"
  circles = d3.selectAll("circle");
  circles.classed(
      'selected', 
      d =>
          d && projection([d.Lon, d.Lat]) &&
          x0 <= projection([d.Lon, d.Lat])[0] &&
          projection([d.Lon, d.Lat])[0] <= x1 &&
          y0 <= projection([d.Lon, d.Lat])[1] &&
          projection([d.Lon, d.Lat])[1] <= y1 
           
  );


  // remove all red bars from barchart
  d3.selectAll("g.highlighted")
    .remove();

  //  brushing for age barchart starts here
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

// brushing for race starts here

var freq_race = {}

// selected for race, NOT "selected race"
var selected_race = d3.selectAll(".selected")
                    .each(function(d) {
                      var race = d["Race"]
                      console.log(race)
                      switch(race) {
                        case "White/Caucasian":
                          race = "Caucasian"
                          break;
                        case "African American":
                          race = "African Am."
                          break;
                        case "American Indian or Alaskan Native":
                          race = "Native Am."
                          break;
                        default:
                          // code block
                      } 

                      if (race != "") {

                        if (freq_race[race]) {
                          freq_race[race] += 1
                          // console.log(freq[agerange]);

                        }
                        else {
                          freq_race[race] = 1

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

var freq_income = {}

var selected_income = d3.selectAll(".selected")
                    .each(function(d) {
                      var income = d["Please indicate your household income"]

                      if (income != "") {

                        if (freq_income[income]) {
                          freq_income[income] += 1
                          // console.log(freq[income]);

                        }
                        else {
                          freq_income[income] = 1

                        }
                      }

  }); 

// convert freq to list of objects, category -> size
// var dict = { 'a': 'aa', 'b': 'bb' };
var arr3 = [];  //reuse same arr variable from above

for (var key in freq_income) {
   if (freq_income.hasOwnProperty(key)) {
       arr3.push( { range: key, frequency: freq_income[key] }  );
   }
}
console.log(arr3);

// add new red rectangles over the bar chart, indicating selected
d3.select("#chartcontainer3")
  .append("g")
    .attr("class", "highlighted")
    .selectAll(".barx")
      .data(arr3)
    .enter().append("rect")
      .attr("class", "barx")
      .attr("x", function(d) { return x_income(d.range); })
      .attr("width", x_income.bandwidth())
      .attr("y", function(d) { return y_income(d.frequency); })
      .attr("height", function(d) { return height - y_income(d.frequency); })
      .attr("fill", "red");


}
function brushend() {
}

var legend = svg
  .append("g")
  .attr("class", "legend")
  .attr("width", 140)
  .attr("height", 200)
  .selectAll("g")
  .data([
    {'color': 'steelblue', 'label': 'Festival Attendee'}, 
    {'color': 'red', 'label': 'Selected'}
  ])
  .enter()
  .append("g")
  .attr("transform", function(d, i) {
    return "translate(0," + i * 20 + ")";
  });

legend
  .append("rect")
  .attr("width", 8)
  .attr("height", 8)
  .style("fill", function(d) { 
    return d.color
  });

legend
  .append("text")
  .attr("x", 8)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("font", "12px arial")
  .text(function(d) { return d.label });