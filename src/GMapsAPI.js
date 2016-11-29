/* global google */
var gmaps = null;

if(typeof google === "undefined" || typeof google.maps === "undefined") {
  throw "ReferenceError: Google Maps has not been loaded.";
} else {
  gmaps = google.maps;
}

export default gmaps;
