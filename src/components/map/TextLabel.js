import gmaps from '../../GMapsAPI';

import classnames from 'classnames/bind';
import styles from '../../stylesheets/TextLabel.scss';
const cx = classnames.bind(styles);

/* http://stackoverflow.com/a/3955258 */
function TextLabel(pos, txt, map) {
  this.pos = pos;
  this.txt_ = txt;
  this.cls_ = cx('text-label');
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

  this.div_ = div;

  var panes = this.getPanes();
  panes.markerLayer.appendChild(div);
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
