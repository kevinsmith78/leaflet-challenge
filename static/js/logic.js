//Use This link to Get geojson data
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";


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

//     console.log("control.layers");
// //get colour radius from the query URL
// d3.json(link, function(data){
//     function style(feature) {
//         return {
//             opacity: 1,
//             fillopacity: 1,
//             fillcolor: getColor(feature.properties.mag),
//             color: "grey",
//             radius: getRadius(feature.properties.mag),
//             stroke: true,
//             weight: 0.5
//         };
//     }

//     function mapColour(mag) { };
// //Create the variable for the circle in the eathquake map
// function CirColour(size) {
//     if (magnitude >= 5) {
//          return "red";
//      }
//      else if (magnitude >= 4) {
//          return "darkorange";
//      }
//      else if (magnitude >= 3) {
//          return "orange";
//      }
//       else if (magnitude >= 2) {
//           return "yellow";
//       }
//       else if magnitude >= 1 {
//           return "green";
//       }
//   };