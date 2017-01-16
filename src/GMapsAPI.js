/* global google */
/**
 * A wrapper for the Google Maps API. This is used in testing so that the
 * Google Maps API can be mocked.
 * @module GMaps
 */
var gmaps = null;

if(typeof google === "undefined" || typeof google.maps === "undefined") {
  throw "ReferenceError: Google Maps has not been loaded.";
} else {
  gmaps = google.maps;
}

export default gmaps;
