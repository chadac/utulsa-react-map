var Utilities = new Object();

Utilities.generateMarkers = function(count) {
  var markers = [];
  for(var i = 1; i <= count; i++) {
    markers.push(Utilities.generateMarker(i));
  }
  return markers;
}

Utilities.generateMarker = function(id) {
  return {
    id: 'item' + id,
    marker: {
      lat: 36.153473,
      lng: -95.946304,
      icon: "http://utulsa-assets.s3.amazonaws.com/web/static/v1/images/tu_map_icon.png"
    },
    gmaps: {
      min_zoom: 16,
    },
  };
}

Utilities.generateRoutes = function(count) {
  var routes = [];
  for(var i = 0; i <= count; i++) {
    routes.push(Utilities.generateRoute(i));
  }
  return routes;
}

Utilities.generateRoute = function(id) {
  return {
    id: 'route' + id,
    $active: true,
    $infoWindow: false,
    $selected: false,
    route: {
      path: [{lat: 36.27321, lng: -95.23091}, {lat: 36.7162, lng: -95.8372}],
      strokeColor:"#FF0000",
      strokeOpacity:"1.0",
      strokeWeight:"2"
    },
    gmaps: {
      min_zoom: 16,
    },
  };
}

module.exports = Utilities;
