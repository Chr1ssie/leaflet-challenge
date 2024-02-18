//set global variable
var myMap={};
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//query URL with d3
d3.json(queryUrl).then(data=>{
    createFeatures(data.features);
});

//set colors
var hue = ["#7CFC00","#DFFF00","#FFF31","#F4C430","#FF7518","#FF0800"];
function circleHue(magnitude){
    if(magnitude < 1) {
        return hue[0];
    }
    else if (magnitude < 2){
        return hue[1];
    }
    else if (magnitude < 3){
        return hue[2];
    }
    else if (magnitude < 4){
        return hue[3];
    }
    else if (magnitude < 5){
        return hue[4];
    }
    else  
        return hue[5];
    }  

//Function to create marker size for earthquakes
function calcRadius(magnitude){
    return(magnitude/5)*20;
}

//Create marker alyer and popup
function createFeatures(earthquakeData){
    //create geojson layer
    var earthquakes = L.geoJSON(earthquakeData, {

        //create circle markers based on earthquake magnitude
        pointTolayer: function(feature){
            return L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]],{
                fillColor: circleHue(+feature.properties.mag),
                color: "rgb(153,51,204)",
                weight: 0.5,
                opacity: 0.7,
                fillOpacity: 0.7,
                radius: calcRadius(+feature.properties.mag)
            });
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup("<h5>"+ feature.properties.place +
            "</h5><hr><p>Magnitude: "+ feature.properties.mag + "</p>");
        }
    });
    //add layer to the createMap function
    createMap(earthquakes);
}

//create map layers
function createMap(earthquakes){
    //create tile layer
    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={access_token}",{
        attribution: "Map data&copy;<a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    var lightmap = L.tilelayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={access_token}",{
        attribution: "Map data&copy;<a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY

    });

    var terrainmap= L.tilelayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={access_token}",{
        attribution: "Map data&copy;<a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });    

    //object to hold base layers
    var baseMaps = {
        "Satellite": satellitemap,
        "Grayscale": lightmap,
        "Terrain": terrainmap
    };
    //overlay object to hold overlay layer
    var overlayMaps = {
        Eartquakes: earthquakes
    };

    //create map
    myMap = L.map("map", {
        center: [32.00, -87.00],
        zoom: 3,
        layers: [satellitemap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
    info.addTo(myMap);
};

//create a legend and postion on bottom of map

var info = L.control({position:"bottomright"});

//insert a div with the class legend
info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");

    //create labels and values 
    var magnitudeLabels = ["0-1","1-2", "2-3", "3-4","4-5","5+"];
    var magnitudeScale = [0.5, 1.5, 2.5, 3.5, 4.5, 5.5];

    //inner HTML
    div.innerHTML = '<div><strong>Legend</strong></div>';
    for (var i = 0; i < magnitudeScale.length; i++) {
        div.innerHTML += '<i style = "background: ' + circleHue(magnitudeScale[i])
        + '"></i>&nbsp; ' + magnitudeLabels[i] +'<br/>';
    };
    return div;
};

