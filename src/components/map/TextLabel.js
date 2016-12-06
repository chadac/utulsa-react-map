import gmaps from '../../GMapsAPI';

/* http://stackoverflow.com/a/3955258 */
function TextLabel(pos, txt, cls, map) {
  this.pos = pos;
  this.txt_ = txt;
  this.cls_ = cls;
  this.map_ = map;

  this.div_ = null;

  this.setMap(map);
}
TextLabel.prototype = new gmaps.OverlayView();
TextLabel.prototype.onAdd = function() {
  var div = document.createElement('div');
  div.className = this.cls_;
  div.innerHTML = '<span>' + this.txt_ + '</span>';
  div.style.width = "100px";
  div.style.zIndex = 10;

  this.div_ = div;
  // var overlayProjection = this.getProjection();
  // var position = overlayProjection.fromLatLngToDivPixel(this.pos);

  var panes = this.getPanes();
  panes.overlayLayer.appendChild(div);
};
TextLabel.prototype.draw = function() {
  var overlayProjection = this.getProjection();

  var position = overlayProjection.fromLatLngToDivPixel(this.pos);

  var div = this.div_;
  div.style.left = (position.x - 50) + 'px';
  div.style.top = (position.y) + 'px';
};
TextLabel.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
  this.div_ = null;
};

module.exports = TextLabel;
