/* global google */
var gmaps = null;

if(typeof google === "undefined" || typeof google.maps === "undefined") {
  throw "Google Maps was not loaded.";
} else {
  gmaps = google.maps;
}

export default gmaps;
