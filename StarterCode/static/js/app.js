let sampleUrl = "https://raw.githubusercontent.com/huddack20/plot-Belly-Button-Biodiversity/main/samples.json";

d3.json(sampleUrl).then(function (importedData) {
	console.log(importedData);

	let data = importedData;

	let names = data.names;

	names.forEach((name) => {
		d3.select("#selDataset").append("option").text(name);

	});

	function init() {

		let defaultDataset = data.samples.filter(sample => sample.id === "940")[0];
		console.log(defaultDataset);


		let defaultSampleValues = defaultDataset.sample_values;
		let defaultOtuIds = defaultDataset.otu_ids;
		let defaultOtuLabels = defaultDataset.otu_labels;

		let defaultTenSampleValues = defaultSampleValues.slice(0, 10).reverse();
		let defaultTenOtuIds = defaultOtuIds.slice(0, 10).reverse();
		let defaultTenOtuLabels = defaultOtuLabels.slice(0, 10).reverse();

		var trace1 = {
			x: defaultTenSampleValues,
			y: defaultTenOtuIds.map(otuId => `OTU ${otuId}`),
			text: defaultTenOtuLabels,
			type: "bar",
			orientation: "h"
		};

		var barData = [trace1];

		var barlayout = {

			title: '<b>Top 10 OTUs in an individual ID',
			xaxis: { title: "Sample Value"},
			yaxis: { title: "OTU ID"},
			autosize: false,
			width: 500,
			height: 600
		};

		Plotly.newPlot("bar", barData, barlayout);

		var trace2 = {
                        x: defaultOtuIds,
                        y: defaultSampleValues,
                        text: defaultOtuLabels,
                        mode: "markers",
                        marker: {
				color: defaultOtuIds,
				size: defaultSampleValues
			}
                };

		var bubbleData = [trace2];

		var bubbleLayout = { width: 1100, height: 450, 
			title: '<b>Bubble Chart displaying sample values of OTU IDs of selected individual',
			xaxis: { title: "OTU ID"},
			yaxis: { title: "Sample Value"},
			showlegend: false
		};

		Plotly.newPlot("bubble", bubbleData, bubbleLayout);

		// DEMPGRAPHIC INFO
		
		defaultDemo = data.metadata.filter(sample => sample.id === 940)[0];
		console.log(`Default Demographic: ${defaultDemo}`);

		Object.entries(defaultDemo).forEach(
			([key, value]) => d3.select("#sample-metadata").append("p").attr('style', 'font-weight: bold').text(`${key.toUpperCase()}: ${value}`)
		);


		// Advanced Challenge: Gauge Chart
		// Get the washing frequency vale for the default test ID
		
		var defaultwfreq = defaultDemo.wfreq;

		var gaugeData = [

			{
				domain: { x: [0, 1], y: [0,1] },
				value: defaultwfreq,
				title: {text: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week'},
				type: "indicator",
				mode: "gauge+number",
				gauge: {
					bar: { color: "red" },
					axis: { range: [null, 9] },
					steps: [
						{ range: [0, 1], color: 'rgb(248, 243, 236)' },
						{ range: [1, 2], color: 'rgb(244, 241, 229)' },
						{ range: [2, 3], color: 'rgb(233, 230, 202)' },
						{ range: [3, 4], color: 'rgb(229, 231, 179)' },
						{ range: [4, 5], color: 'rgb(213, 228, 157)' },
						{ range: [5, 6], color: 'rgb(183, 204, 146)' },
						{ range: [6, 7], color: 'rgb(140, 191, 136)' },
						{ range: [7, 8], color: 'rgb(138, 187, 143)' },
						{ range: [8, 9], color: 'rgb(133, 180, 138)' }
					],

				}

			}

		];

		var gaugeLayout = { width: 500, height: 500, margin: { t:0, b:0} };

		Plotly.newPlot('gauge', gaugeData, gaugeLayout);

	};

	init();

	//d3.selectAll("#selDataset").on("change", updatePlot);


	function updatePlot() {

		var inputElement = d3.select("#selDataset");

		var inputValue = inputElement.property("value");

		console.log("Update Values");

		dataset = data.samples.filter(sample => sample.id === inputValue)[0];

		console.log(dataset);

		allSampleValues = dataset.sample_values;
		allOtuIds = dataset.otu_ids;
		allOtuLabels = dataset.otu_labels;

		top10Values = allSampleValues.slice(0, 10).reverse();
		top10Ids = allOtuIds.slice(0, 10).reverse();
		top10Labels = allOtuLabels.slice(0, 10).reverse();

		Plotly.restyle("bar", "x", [top10Values]);
		Plotly.restyle("bar", "y", [top10Ids.map(otuId => `OTU ${otuId}`)]);
		Plotly.restyle("bar", "text", [top10Labels]);

		Plotly.restyle('bubble', "x", [allOtuIds]);
		Plotly.restyle('bubble', "y", [allSampleValues]);
		Plotly.restyle('bubble', "text", [allOtuLabels]);
		Plotly.restyle('bubble', "marker.color", [allOtuIds]);
		Plotly.restyle('bubble', "marker.size", [allSampleValues]);

		// DEMOGRAPHIC INFO
		metainfo = data.metadata.filter(sample => sample.id == inputValue)[0];

		// Clear out current contents in the panel
		d3.select("#sample-metadata").html("");

		// Display each key-value pair from the metadata JSON object
		Object.entries(metainfo).forEach(([key, value]) => d3.select("#sample-metadata").append("p").text(`${key}: ${value}`));

		// ADVANCED CHALLENGE: GAUGE CHART
		var wfreq = metainfo.wfreq;

		Plotly.restyle('gauge', "value", wfreq);

	};

	d3.selectAll("#selDataset").on("change", updatePlot);

});
