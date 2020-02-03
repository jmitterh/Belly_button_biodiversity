// The function initializes the dropdown and the the optionChange to update all the graphs and data
function selectInit() {
    // Importing data from local file
    d3.json("./samples.json").then((importData) => {
        var data = importData;

        // Searching names through json file
        var names = data["names"];

        // Adding list of id names to dropdown menu
        names.map(function (idList) {
            var option = d3.select("#selDataset")
            option.append("option")
                .text(idList)
                .property("value", idList);
        });
        // Display default data 940
        var firstData = names[0];

        // Caling functions to display data to default id
        metaData(firstData);
        bar(firstData);
        bubble(firstData);
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
function bar(select) {
    d3.json("./samples.json").then((importData) => {
        var data = importData;
        var samples = data["samples"];

        // Use filter() to pass selection as an argument
        var filterSelect = samples.filter(data => data.id == select);

        // Build variables for graphs
        var id = filterSelect[0].otu_ids;
        var value = filterSelect[0].sample_values;
        var label = filterSelect[0].otu_labels;

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
            yBar.push(`OTU ${v}`);
        });

        // Trace is for the Bar graph data
        var trace = {
            x: barValue,
            y: yBar,
            text: barLabel,
            type: "bar",
            orientation: "h"
        };

        // data
        var data = [trace];

        // Apply layout
        var layout = {
            title: `Top 10 UTO's for ID: ${select}`
        };

        // Render the plot to the div tag with id "bar"
        Plotly.newPlot("bar", data, layout);
    });
};


// Function for the Bubble graph
function bubble(select) {
    d3.json("./samples.json").then((importData) => {
        var data = importData;
        var samples = data["samples"];

        // Use filter() to pass selection as an argument
        var filterSelect = samples.filter(data => data.id == select);

        // Build variables for graphs
        var id = filterSelect[0].otu_ids;
        var value = filterSelect[0].sample_values;
        var label = filterSelect[0].otu_labels;

        /////////////////////////////////////////////////
        // Build variables for Bubble Chart 
        var xBubble = id;
        var yBubble = value;
        var bubbleLabel = label;

        var cSize = value
        var cColor = value;

        // Trace is for the Bubble graph data
        var trace = {
            x: xBubble,
            y: yBubble,
            text: bubbleLabel,
            mode: 'markers',
            marker: {
                size: cSize,
                color: cColor
            }
        };

        // data
        var data = [trace];

        // Apply layout
        var layout = {
            title: `Different microbial “species” (technically operational taxonomic units, OTUs) across the belly button, for sample ID: ${select}`
        };

        // Render the plot to the div tag with id "bubble"
        Plotly.newPlot("bubble", data, layout)
    });

};

// Function for the Belly Button Washing Freqency
function gauge(select) {
    d3.json("./samples.json").then((importData) => {
        var data = importData;
        var metaData = data["metadata"];

        //Use filter() to pass selection as an argument
        var filterSelect = metaData.filter(data => data.id == select);

        //Variable for washing frequency
        var washingFreq = filterSelect[0].wfreq;

        // data
        var data = [
            {
                type: "indicator",
                mode: "gauge+number",
                value: washingFreq,// change value with washing freq
                title: { text: "Belly Button Washing Frequency Per Week", font: { size: 24 } },
                gauge: {
                    axis: { range: [0, 9], tickwidth: 1, tickcolor: "darkblue" },
                    bar: { color: "darkblue" },
                    bgcolor: "white",
                    borderwidth: 3,
                    bordercolor: "darkblue",
                    steps: [
                        { range: [0, 1], color: "#cc0000" },
                        { range: [1, 2], color: "#cc3300" },
                        { range: [2, 3], color: "#cc6600" },
                        { range: [3, 4], color: "#cc9900" },
                        { range: [4, 5], color: "#cccc00" },
                        { range: [5, 6], color: "#99cc00" },
                        { range: [6, 7], color: "#66cc00" },
                        { range: [7, 8], color: "#33cc00" },
                        { range: [8, 9], color: "#00cc00" }
                    ],
                    threshold: {
                        line: { color: "cyan", width: 6 },
                        thickness: 1.0,
                        value: washingFreq
                    } 
                }
            }
        ];
        // Applu layout
        var layout = {
            width: 500,
            height: 400,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            paper_bgcolor: "white",
            font: { color: "darkblue", family: "Arial" }
        };
        // Render the plot to the div tag with id "gauge"
        Plotly.newPlot('gauge', data, layout);
    });
};

// Function onchange is initiated when selection is selected from drop down
function optionChanged(select) {
    metaData(select);
    bar(select);
    bubble(select);
    gauge(select);
};

// initializing function when site is up and running
selectInit();