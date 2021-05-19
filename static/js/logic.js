//Use This link to Get geojson data
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"

var plate = "https://earthquake.usgs.gov/arcgis/rest/services/eq/map_plateboundaries/MapServer?f=pjson"

//Grabbing the GeoJSON data
d3.json(link).then(function (data) {
    // Creating a GeoJSON layer with the retrieved data
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    console.log("createFeatures");
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
    function pointFunction(feature, layer) {
        // console.log(feature)
        return L.circleMarker(layer, { radius: feature.properties.mag * 10 });
    }
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature, //add popups
        pointToLayer: pointFunction // add circles
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

// set different color from magnitude
    function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "red";
    case magnitude > 4:
      return "orange";
    case magnitude > 3:
      return "gold";
    case magnitude > 2:
      return "yellow";
    case magnitude > 1:
      return "green";
    default:
      return "blue";
    }
}

// add legend
var legend = L.control({
    position:"bottom right"
});

legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [0,1,2,3,4,5];
    var colors = [
        "blue",
        "green",
        "yellow",
        "gold",
        "orange",
        "red"
    ];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          "<i style='background: " + colors[i] + "'></i> " +
          grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
};


function createMap(earthquakes) {
    console.log("createMap");
    // Add the dark layer
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });
    //Adding the Tile Layer 
    var streets = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    // Only one base Layer can shown at a time
    var baseMaps = {
        "streets": streets,
        "darkmap": darkmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };
    //

    var myMap = L.map("mapid", {
        center: [37.7728, 122.0059],
        zoom: 5,
        layers: [streets, earthquakes]
    });
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}