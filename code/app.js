const data = '../data/samples.json';
let id_select = d3.select('#selDataset');
let meta_panel = d3.select('#sample-metadata');

function init() {
    var dropdown = id_select;
    d3.json(data).then(function (data) {
        data_set = data;
        console.log(data_set);
        data.names.forEach((name => {
            dropdown.append('option').text(name).property('value', name);
        }));
        sample_id = dropdown.property('value');
        console.log(sample_id);
        demographics(sample_id);
        barchart(sample_id);
        bubblechart(sample_id);
        gaugechart(sample_id);
    });
};


// function to display the data with the selected item from the dropdown menu
function optionChanged(sample_id) {
    console.log(sample_id);
    demographics(sample_id);
    barchart(sample_id);
    bubblechart(sample_id);
    gaugechart(sample_id);
};

// function to disply demographic info for the selected sample id
function demographics(selected_id) {
    // clear panel data when new selection
    meta_panel.html('');

    // store retrieved data into variable and log in console
    d3.json(data).then(function (data) {
        var results_array = data.metadata.filter(object => object.id.toString() == selected_id)[0];
        console.log(results_array);
        // display results
        Object.entries(results_array).forEach(([key, value]) => {
            meta_panel.append('h5').text(`${key}: ${value}`);
        });
    });
};

// function to build the charts
function barchart(selected_id) {
    d3.json(data).then(function (data) {
        var bacteria_array = data.samples.filter(object => object.id.toString() == selected_id)[0];
        console.log(bacteria_array);

        // create the trace for the bar chart
        var trace = {
            x: bacteria_array.sample_values.slice(0, 10).reverse(),
            y: bacteria_array.otu_ids.slice(0, 10).reverse().map(row => ' OTU-' + row + '  '),
            text: bacteria_array.otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h'
        };

        // make bar plot data array
        var bar_data = [trace];

        // set bar plot layout
        var layout = {
            height: 600,
            width: 400
        };

        // plot the bar chart with the div tag id 'bar'
        Plotly.newPlot('bar', bar_data, layout);
    });
};
function bubblechart(selected_id) {
    d3.json(data).then(function (data) {
        var bacteria_array = data.samples.filter(object => object.id.toString() == selected_id)[0];
        console.log(bacteria_array);

        // create the trace for the bubble chart
        var trace = {
            x: bacteria_array.otu_ids,
            y: bacteria_array.sample_values,
            text: bacteria_array.otu_labels,
            mode: 'markers',
            marker: {
                size: bacteria_array.sample_values,
                color: bacteria_array.otu_ids,
                colorscale: 'Portland'
            }
        };

        // make bubble plot data array
        var bubble_data = [trace];

        // set bubble plot layout
        var layout = {
            height: 600,
            width: 1200,
            xaxis: { title: '<b>OTU ID</b>' },
            yaxis: { title: '<b>Sample Value</b>' }
        };

        // plot the bubble chart with the div tag id 'bubble'
        Plotly.newPlot('bubble', bubble_data, layout);
    });
};
function gaugechart(selected_id) {
    // retreive wash frequency (wfreq)
    d3.json(data).then(function (data) {
        var results_array = data.metadata.filter(object => object.id.toString() == selected_id)[0];
        var wfreq = results_array.wfreq;
        console.log(wfreq);
        data = getData(wfreq);
    
      function getData(wfreq) {
        var data = [],
          start = Math.round(Math.floor(wfreq / 10) * 10);
        data.push(wfreq);
        for (i = start; i > 0; i -= 10) {
          data.push({
            y: i
          });
        }
        return data;
      }
    
      Highcharts.chart('gauge', {
        chart: {
          type: 'solidgauge',
          marginTop: 48
        },
        
        title: {
          text: 'Belly Button Washing Freq.<br>Scrubs per Week'
        },
        
        subtitle: {
          text: wfreq,
          style: {
            'font-size': '60px'
          },
          y: 200,
          zIndex: 7
        },
    
        tooltip: {
          enabled: false
        },
    
        pane: [{
          startAngle: -120,
          endAngle: 120,
          background: [{ // Track for Move
            outerRadius: '100%',
            innerRadius: '80%',
            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),
            borderWidth: 0,
            shape: 'arc'
          }],
          size: '120%',
          center: ['50%', '65%']
        }, {
          startAngle: -120,
          endAngle: 120,
          size: '95%',
          center: ['50%', '65%'],
          background: []
        }],
    
        yAxis: [{
          min: 0,
          max: 9,
          lineWidth: 2,
          lineColor: 'white',
          tickInterval: 1,
          labels: {
            enabled: false
          },
          minorTickWidth: 0,
          tickLength: 50,
          tickWidth: 5,
          tickColor: 'white',
          zIndex: 6,
          stops: [
            [0, '#fff'],
            [0.101, '#ed0022'],
            [0.201, '#f43021'],
            [0.301, '#fc6114'],
            [0.401, '#ff8c00'],
            [0.501, '#ffad00'],
            [0.601, '#edbd02'],
            [0.701, '#c6bf22'],
            [0.801, '#92b73a'],
            [0.901, '#4aa84e'],
            [1, '#009a60']
          ]
        }, {
          linkedTo: 0,
          pane: 1,
          lineWidth: 5,
          lineColor: 'white',
          tickPositions: [],
          zIndex: 6
        }],
        
        series: [{
          animation: false,
          dataLabels: {
            enabled: false
          },
          borderWidth: 0,
          color: Highcharts.getOptions().colors[0],
          radius: '100%',
          innerRadius: '80%',
          data: data
        }]
      });
    });
};


init();

