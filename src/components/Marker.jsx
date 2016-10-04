import React, {Component} from 'react';
import ItemStore from '../stores/ItemStore';
import ItemActions from '../actions/ItemActions';
import classNames from 'classnames';
import styles from '../stylesheets/Marker.scss';
import gmaps from '../GMapsAPI';
import MapIcon from '../data/mapIcons.json';

// From http://stackoverflow.com/q/373157
function partial(func /*, 0..n args */) {
  var args = Array.prototype.slice.call(arguments).splice(1);
  return function() {
    var allArguments = args.concat(Array.prototype.slice.call(arguments));
    return func.apply(this, allArguments);
  };
}

// From http://stackoverflow.com/a/12410385
function isInfoWindowOpen(infoWindow) {
  var map = infoWindow.getMap();
  return (map !== null && typeof map !== "undefined");
}

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

  this.div_ = div;
  var overlayProjection = this.getProjection();
  var position = overlayProjection.fromLatLngToDivPixel(this.pos);

  var panes = this.getPanes();
  panes.overlayLayer.appendChild(div);
};
TextLabel.prototype.draw = function() {
  var overlayProjection = this.getProjection();

  var position = overlayProjection.fromLatLngToDivPixel(this.pos);

  var div = this.div_;
  div.style.left = (position.x-50) + 'px';
  div.style.top = (position.y) + 'px';
};
TextLabel.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
  this.div_ = null;
};

const Marker = React.createClass({

  getInitialState() {
    return {
      $infoWindowOpened: false
    };
  },

  componentWillMount() {
    ItemStore.addSelectListener(this.props.id, this._onSelect);

    this.info = this.createInfoWindow();
    this.info.addListener("closeclick", this._onCloseInfoWindow);

    this.marker = this.createMarker();
    this.marker.addListener("click", this._onClick);
    this.marker.addListener("mouseover", this._onMouseOver);
    this.marker.addListener("mouseout", this._onMouseOut);

    this.label = this.createLabel();
  },

  componentDidMount() {
  },

  componentWillUnmount() {
    this.info.close();
    this.marker.setMap(null);
    this.label.setMap(null);
  },

  latlng() {
    return new gmaps.LatLng(
      this.props.marker.lat,
      this.props.marker.lng
    );
  },

  createMarker() {
    return new gmaps.Marker({
      position: this.latlng(),
      icon: MapIcon[this.props.marker.icon],
      draggable: false,
      map: this.props.map,
    });
  },

  createLabel() {
    return new TextLabel(this.latlng(), this.props.name, styles.markerLabel, this.props.map);
  },

  createInfoWindow() {
    var content = "<h4>" + this.props.name + "</h4>"
                + "<p>" + this.props.address + "</p>"
                + "<p>" + this.props.website + "</p>";
    return new gmaps.InfoWindow({
      content: content
    });
  },

  render() {
    if(this.props.$infoWindow && !isInfoWindowOpen(this.info)) {
      // Keeping this just in case I need to see lat/lng again
      /* console.log(this.marker.position.lng());
       * this.info.setContent(
       *   "<table><tr><td>" + this.marker.position.lat() + "</td><td>"
       *   + this.marker.position.lng() + "</td></tr></table>"
       * );*/
      this.info.open(this.props.map, this.marker);
    }
    else if(!this.props.$infoWindow && isInfoWindowOpen(this.info)) {
      this.info.close();
    }
    return null;
  },

  _onClick() {
    ItemActions.openInfoWindow(this.props.id);
  },

  _onMouseOver() {
  },

  _onMouseOut() {
  },

  _onCloseInfoWindow() {
    ItemActions.closeInfoWindow();
  },

  _onSelect() {
    // This runs on a delay so that the map component can react to changes correctly.
    setTimeout( () => {
      this.props.map.setZoom(18);
      this.props.map.setCenter(this.latlng());
    }, 300);
  },

});

export default Marker;
