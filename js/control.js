// The SVG container
var width  = 850,
    height = 400;

var color = d3.scale.category10();
var data = {};

$.ajaxSetup ({
    // Disable caching of AJAX responses
    cache: false
});

$(document).ready(function() {
	queue()
	    .defer(d3.csv, "data/test-data.csv")
	    .await(ready);
});

function getColor(d,i){
	var overlayHueMin = 238,
	overlayHueMax = 240,
	overlaySatMin = 1,
	overlaySatMax = 1,
	overlayValMin = 0.95,
	overlayValMax = 0.8;
	
	var p = d.odbdata[year]["ODB-Scaled"] / 40;
	var h = overlayHueMin + p * (overlayHueMax - overlayHueMin);
	var s = overlaySatMin + p * (overlaySatMax - overlaySatMin);
	var v = overlayValMin + p * (overlayValMax - overlayValMin);
	return d3.hsl(h,s,v);
}

function ready(error, d) {
	data = d;
	drawKey(d);
	drawStats(d);
};

var legendVals = {};

function drawKey(d) {
	for (i=0;i<d.length;i++) {
		text = d[i]["Type"];
		enabled = true;
		legendVals[text] = enabled;
	}
	for (item in legendVals) {
		var output = '<input type="checkbox" checked="true" id="' + item + '" onClick="toggle(\''+item+'\');"/>' + item + '<br/>';
		$('#legend').append(output);
	}
}

function toggle(id) {
	if (legendVals[id]) {
		legendVals[id] = false;
	} else {
		legendVals[id] = true;
	}
	drawStats(data);
}

function drawStats(d) {
	var top = [];
	var keyit = d[0];
	var keys = Object.keys(keyit).reverse();
	for (i=0;i<d.length;i++) {
		var data = [];
		for (j=0;j<keys.length;j++){
			var obj = {};
			key = keys[j].replace(/_/g," ");
			if (key != "Type" && legendVals[d[i]["Type"]]) {
				obj.axis = key;
				obj.value = d[i][keys[j]] / 4;
				data.push(obj);
			}
		}
		if (legendVals[d[i]["Type"]]) {	
			top.push(data);
		}
	}
	RadarChart.draw("#radar", top, 0);	
}
