import React, {Component} from 'react';
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

const Marker = React.createClass({
  getInitialState() {
    return {
      $hover: false
    };
  },

  componentWillMount() {
    var key = this.props.id;
    this.marker = this.createMarker();
    this.marker.addListener("click", this._onClick);
    this.marker.addListener("mouseover", this._onMouseOver);
    this.marker.addListener("mouseout", this._onMouseOut);
    this.info = this.createInfoWindow();
  },

  componentWillUnmount() {
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
    if(this.props.$hover) {
      this.info.open(this.map, this.marker);
    }
    else {
      this.info.close();
    }
    return null;
  },

  _onClick() {
  },

  _onMouseOver() {
  },

  _onMouseOut() {
  },
});

export default Marker;
