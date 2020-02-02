// The function initializes the dropdown and the the optionChange to update all the graphs and data
function selectInit() {
    d3.json("./samples.json").then((importData) => {
        var data = importData;
        //console.log(data)
        var names = data["names"];
        //console.log(names);
        names.map(function (idList) {
            var option = d3.select("#selDataset")
            option.append("option")
                .text(idList)
                .property("value", idList);
        });
        // Display default data 940
        var firstData = names[0];
        //console.log(firstData);
        metaData(firstData);
        graph(firstData);
        gauge(firstData);
    });
};


// Function for the Demographic Info
function metaData(select) {
    d3.json("./samples.json").then((importData) => {
        var data = importData;
        var metaData = data["metadata"];

        //Use filter() to pass selection as an argument
        var filterSelect = metaData.filter(data => data.id == select);

        console.log(filterSelect);
        // Get the id of the metadata
        var sampleMetaData = d3.selectAll("#sample-metadata");

        // Clear any data within the sample metadata
        sampleMetaData.html("");

        Object.entries(filterSelect[0]).forEach(([key, val]) => {
            var option = sampleMetaData.append("p");
            option.text(`${key}: ${val}`);

        })
    })
};


// Function for the OTU var and bubble graph
function graph(select) {
    d3.json("./samples.json").then((importData) => {
        var data = importData;
        var samples = data["samples"];

        // Use filter() to pass selection as an argument
        var filterSelect = samples.filter(data => data.id == select);
        console.log(filterSelect[0]);

        // Build variables for graphs
        var id = filterSelect[0].otu_ids;
        var value = filterSelect[0].sample_values;
        var label = filterSelect[0].otu_labels;
        console.log(value);

        //////////////////////////////
        // build variable for bar graph
        var barId = id;
        var barValue = value;
        var barLabel = label;

        // Sort the data array using the greekSearchResults value
        barValue.sort(function (a, b) {
            return parseFloat(b.sample_values) - parseFloat(a.sample_values);
        });

        // Slice ordered variables
        barId = barId.slice(0, 10);
        barValue = barValue.slice(0, 10);
        barLabel = barLabel.slice(0, 10);

        // Reverse the array due to Plotly's defaults
        // And to keep everything congruent
        barId = barId.reverse();
        barValue = barValue.reverse();
        barLabel = barLabel.reverse();

        //Empty array to store new Label
        yBar = [];

        // Iterate through object to alter object label and store into array
        Object.entries(barId).forEach(([k, v]) => {
            //console.log(`otu_${v}`)
            yBar.push(`OTU ${v}`);
        });


        console.log("bar ID: ", yBar);
        //console.log("sorted and sliced: " + barValue)

        // Trace1 is for the Bar graph data
        var trace1 = {
            x: barValue,
            y: yBar,
            text: barLabel,
            type: "bar",
            orientation: "h"
        };

        // data
        var barData = [trace1];

        // Apply layout
        var layout1 = {
            title: "Bar Graph"
        };

        // Render the plot to the div tag with id "bar"
        Plotly.newPlot("bar", barData, layout1);


        /////////////////////////////////////////////////
        // Build variables for Bubble Chart 
        var xBubble = id;
        var yBubble = value;
        var bubbleLabel = label;

        var mSize = value
        var mClrs = value;

        // Trace1 is for the Bubble graph data
        var trace2 = {
            x: xBubble,
            y: yBubble,
            text: bubbleLabel,
            mode: 'markers',
            marker: {
                size: mSize,
                color: mClrs
            }
        };

        // data
        var scatterData = [trace2];

        // Apply layout
        var layout2 = {
            title: "Bubble Graph"
        };

        // Render the plot to the div tag with id "bubble"
        Plotly.newPlot("bubble", scatterData, layout2)

    });
};


// Function for the Belly Button Washing Freqency
function gauge(select) {
    d3.json("./samples.json").then((importData) => {
        var data = importData;
        var metaData = data["metadata"];

        //Use filter() to pass selection as an argument
        var filterSelect = metaData.filter(data => data.id == select);
        console.log("Gauge", filterSelect)

        //Variable for washing frequency
        var washingFreq = filterSelect[0].wfreq;

        var data = [
            {
              type: "indicator",
              mode: "gauge+number+delta",
              value: washingFreq,// change value with washing freq
              title: { text: "Belly Button Washing Frequency Per Week", font: { size: 24 } },
              //delta: { reference: 0, increasing: { color: "RebeccaPurple" } },
              gauge: {
                axis: { range: [0, 9], tickwidth: 1, tickcolor: "darkblue" },
                bar: { color: "darkblue" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                  { range: [0, 1], color: "cyan" },
                  { range: [1, 2], color: "royalblue" },
                  { range: [2, 3], color: "cyan" },
                  { range: [3, 4], color: "royalblue" },
                  { range: [4, 5], color: "cyan" },
                  { range: [5, 6], color: "royalblue" },
                  { range: [6, 7], color: "cyan" },
                  { range: [7, 8], color: "royalblue" },
                  { range: [8, 9], color: "cyan" }
                ],
                threshold: {
                  line: { color: "red", width: 4 },
                  thickness: 0.75,
                  value: washingFreq
                }
              }
            }
          ];
          
          var layout = {
            width: 500,
            height: 400,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            paper_bgcolor: "white",
            font: { color: "darkblue", family: "Arial" }
          };
          
          Plotly.newPlot('gauge', data, layout);
    });
};

// Function onchange is initiated when selection is selected from drop down
function optionChanged(select) {
    metaData(select);
    graph(select);
    gauge(select)
};

// initializing function when site is up and running
selectInit();