import React, {Component} from 'react';
import ItemStore from '../stores/ItemStore';
import ItemActions from '../actions/ItemActions';
import classNames from 'classnames';
import styles from '../stylesheets/Marker.scss';

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
  },

  componentWillUnmount() {
    this.info.close();
    this.marker.setMap(null);
  },

  latlng() {
    return new google.maps.LatLng(
      this.props.marker.lat,
      this.props.marker.lng
    );
  },

  createMarker() {
    return new google.maps.Marker({
      position: this.latlng(),
      icon: "http://utulsa-assets.s3.amazonaws.com/web/static/v1/images/tu_map_icon.png",
      draggable: true,
      map: this.props.map,
    });
  },

  createInfoWindow() {
    var content = "<h4>" + this.props.name + "</h4>"
                + "<p>" + this.props.address + "</p>"
                + "<p>" + this.props.website + "</p>";
    return new google.maps.InfoWindow({
      content: content
    });
  },

  render() {
    if(this.props.$infoWindow && !isInfoWindowOpen(this.info)) {
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
    ItemActions.openInfoWindow(this.props.id);
    this.props.map.setCenter(this.latlng());
    this.props.map.setZoom(this.props.gmaps.min_zoom);
  },
});

export default Marker;
