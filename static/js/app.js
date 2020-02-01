// The function initializes the dropdown and the the optionChange to update all the graphs and data
function dropdownInit() {
    var data = d3.json("./samples.json").then((importData) => {
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

        var firstData = names[0];
        //console.log(firstData);
        metaData(firstData);
        graph(firstData);
    });
};


// Function onchange is initiated when selection is selected from drop down
function optionChanged(select) {
    metaData(select);
    graph(select);
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
    var data = d3.json("./samples.json").then((importData) => {
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
        barValue = barValue.reverse();


        console.log(barId);
        console.log("sorted and sliced " + barValue)

        // Trace1 is for the Bar graph data
        var trace1 = {
            x: barValue,
            y: `UTO_${barId}`,
            text: barId,
            name: "Testing",
            type: "bar",
            orientation: "h"
        };

        // data
        var barData = [trace1];

        // Apply layout
        var layout1 = {
            title: "Bar Graph"
        };

        // Render the plot to the div tag with id "plot"
        Plotly.newPlot("bar", barData, layout1);


        /////////////////////////////////////////////////
        // Bubble Chart 
        var xValues = id;
        var yValues = value;
        var textValues = label;

        var mSize = value
        var mClrs = id;

        // Trace1 is for the Bar graph data
        var trace2 = {
            x: xValues,
            y: yValues,
            text: textValues,
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

        Plotly.newPlot("bubble", scatterData, layout2)



    });
};


// Function for the Belly Button Washing Freqency
function washing() {
    var data = d3.json("./samples.json").then((importData) => {
        var data = importData;
        var names = data["names"];

    });

};

dropdownInit();