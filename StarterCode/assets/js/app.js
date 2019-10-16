
// get data
d3.csv("data.csv").then(function(data) {
    // created below -- added here for readability
    PlotMeDaddy(data);
});

//setting box
var width = parseInt(d3.select("#scatter").style("width"));
var height = width - width / 3.9;

// add room
var margin = 20;

var yWords = 110;

var bottom = 40;
var left = 40;

// Create place to put stuff AKA allocate real estate
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "chart");

// Setting radius so it isnt tiny and finicky --

var circRadius;
function crGet() {
    if (width <= 530) {
        circRadius = 5;
    }
    else {
        circRadius = 10;
    }
}
crGet();

// g is Group
svg.append("g").attr("class", "selText");
// cleaned up code to make it easier to read by adding selText section
var selText = d3.select(".selText");


// adding groups with spacing

selText
    .append("text")
    .attr("y", -26)
    .attr("data-name", "poverty")
    .attr("data-axis", "x")
    .attr("class", "aText active x")
    .text("In Poverty (%)");

selText
    .append("text")
    .attr("y", -26)
    .attr("data-name", "age")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Age (Median)");

selText
    .append("text")
    .attr("y", 26)
    .attr("data-name", "income")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Household Income (Median)");


// Cleanup to read
var cleanX = margin + left;
var cleanY = yWords;


svg.append("g").attr("class", "yText");


var yText = d3.select(".yText");

// Google-foo
function yTextRefresh() {
    yText.attr(
        "transform",
        "translate(" + cleanX + ", " + cleanY + ")"
    );
}
yTextRefresh();


yText
    .append("text")
    .attr("y", -26)
    .attr("data-name", "obesity")
    .attr("data-axis", "y")
    .attr("class", "aText active y")
    .text("Obese (%)");


yText
    .append("text")
    .attr("x", 0)
    .attr("data-name", "smokes")
    .attr("data-axis", "y")
    .attr("class", "aText inactive y")
    .text("Smokes (%)");


yText
    .append("text")
    .attr("y", 26)
    .attr("data-name", "healthcare")
    .attr("data-axis", "y")
    .attr("class", "aText inactive y")
    .text("Lacks Healthcare (%)");





function PlotMeDaddy(theData) {
    // curX and curY will determine what data gets represented in each axis.

    //fit headings

    var curX = "poverty";
    var curY = "obesity";

    // empty var -- clean code referenced later so I didnt have so much repeating

    var xMin;
    var xMax;
    var yMin;
    var yMax;

    // getting and changing empty var above and spacing
    function xMinMax() {
        // referenced above to get the little guy
        xMin = d3.min(theData, function(d) {
            return parseFloat(d[curX]) * 0.90;
        });

        // RT
        xMax = d3.max(theData, function(d) {
            return parseFloat(d[curX]) * 1.10;
        });
    }


    function yMinMax() {
        yMin = d3.min(theData, function(d) {
            return parseFloat(d[curY]) * 0.90;
        });

        yMax = d3.max(theData, function(d) {
            return parseFloat(d[curY]) * 1.10;
        });
    }


    xMinMax();
    yMinMax();

    //scaling with lovely inversions (thanks D3)
    var xScale = d3
        .scaleLinear()
        .domain([xMin, xMax])
        .range([margin + yWords, width - margin]);
    var yScale = d3
        .scaleLinear()
        .domain([yMin, yMax])
        .range([height - margin - yWords, margin]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    svg
        .append("g")
        .call(xAxis)
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + (height - margin - yWords) + ")");
    svg
        .append("g")
        .call(yAxis)
        .attr("class", "yAxis")
        .attr("transform", "translate(" + (margin + yWords) + ", 0)");

    var theCircles = svg.selectAll("g theCircles").data(theData).enter();

    //add circles
    theCircles
        .append("circle")

        .attr("cx", function(d) {
            return xScale(d[curX]);
        })
        .attr("cy", function(d) {
            return yScale(d[curY]);
        })
        .attr("r", circRadius)
        .attr("class", function(d) {
            return "stateCircle " + d.abbr;
        });

    //add words (abbr)
    theCircles
        .append("text")

        .text(function(d) {
            return d.abbr;
        })

        .attr("dx", function(d) {
            return xScale(d[curX]);
        })

        //making it pretty and centered
        .attr("dy", function(d) {
            return yScale(d[curY]) + circRadius / 2.5;
        })
        .attr("font-size", circRadius)
        .attr("class", "stateText");


    d3.selectAll(".aText").on("click", function() {
        var self = d3.select(this);

        // optimization found with google-foo ++ some kewl transitions
        if (self.classed("inactive")) {
            var axis = self.attr("data-axis");
            var name = self.attr("data-name");


            if (axis === "x") {
                curX = name;
                xMinMax();
                xScale.domain([xMin, xMax]);
                svg.select(".xAxis").transition().duration(300).call(xAxis);
                d3.selectAll("circle").each(function() {
                    d3
                        .select(this)
                        .transition()
                        .attr("cx", function(d) {
                            return xScale(d[curX]);
                        })
                        .duration(300);
                });

                d3.selectAll(".stateText").each(function() {

                    d3
                        .select(this)
                        .transition()
                        .attr("dx", function(d) {
                            return xScale(d[curX]);
                        })
                        .duration(300);
                });
                labelChange(axis, self);
            }
            else {
                curY = name;

                yMinMax();

                yScale.domain([yMin, yMax]);
                svg.select(".yAxis").transition().duration(300).call(yAxis);


                d3.selectAll("circle").each(function() {

                    d3
                        .select(this)
                        .transition()
                        .attr("cy", function(d) {
                            return yScale(d[curY]);
                        })
                        .duration(300);
                });


                d3.selectAll(".stateText").each(function() {
                    d3
                        .select(this)
                        .transition()
                        .attr("dy", function(d) {
                            return yScale(d[curY]) + circRadius / 3;
                        })
                        .duration(300);
                });


                labelChange(axis, self);
            }
        }
    });
}