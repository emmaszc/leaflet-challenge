 // Store API query variables
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(queryURL).then(function(data) {
    console.log(data.features);
    var long = data.features.map(d => d.geometry.coordinates[0])
    console.log(long);
    var lat = data.features.map(d => d.geometry.coordinates[1])
    console.log(lat);
    var magnitude = data.features.map(d => d.properties.mag)
    console.log(magnitude);
    var places = data.features.map(d => d.properties.place)
    console.log(places);
    var date = data.features.map(d => Date(d.properties.time))
    console.log(date);

    // Create Map
    var myMap = L.map("map", {
        center: [34.0522, -118.2437],
        zoom: 8
    });

    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: "pk.eyJ1IjoiZW1tYXN6YyIsImEiOiJja2J2Z2NieGMwMWRpMnFtdnozdDc2eW1tIn0.p7H1a96QFcxA6W_sZpImiA"
    }).addTo(myMap);

    // function getColor(d) {
    //     return d > 5 ? '#bd0026' :
    //            d > 4  ? '#f03b20' :
    //            d > 2  ? '#fd8d3c' :
    //            d > 1  ? '#fecc5c' :
    //            d > 0   ? '#ffffb2' :
    // }

    // function style(feature) {
    //     return {
    //         fillColor: getColor(feature.properties.mag),
    //         weight: 2,
    //         opacity: 1,
    //         color: 'white',
    //         dashArray: '3',
    //         fillOpacity: 0.7
    //     };
    // }
    
    // L.geoJson(data, {style: style}).addTo(map);

        for (var i=0; i < places.length; i++) {
            var color = "";
            if (magnitude[i] > 5.0) {
                color = "red"
            }
            else if (magnitude[i] > 4.0) {
                color = "pink";
            }
            else if (magnitude[i] > 3.0) {
                color = "yellow";
            }
            else {
                color = "green";
            }
        L.circle([lat[i],long[i]], {
            fillOpacity: 0.5,
            color: "black",
            fillColor: color,
            radius: magnitude[i]*10000
        }).bindPopup("<h2>" + places[i] + "</h2><hr><ul><li>" + date[i] + "</li><li>Magnitude: " + magnitude[i] + "</li>").addTo(myMap);

    }

    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 3, 4, 5],
        colors = [
          "green",
          "yellow",
          "pink",
          "red"
        ];
        // Loop through our intervals and generate a label with a colored square for each interval.
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML += "<div class='legend-entry' style='background: " + colors[i] + "'> " +
            grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+" + "</div>");
        }
        return div;
      };
      legend.addTo(myMap);

});