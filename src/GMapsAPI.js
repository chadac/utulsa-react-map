var gmaps;
if(google == undefined || google.maps == undefined) {
  gmaps = null;
} else {
  gmaps = google.maps;
}

export default gmaps;
