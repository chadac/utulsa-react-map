import React, {Component} from 'react';
import classNames from 'classnames';
import styles from '../stylesheets/Marker.scss';

const Marker = React.createClass({
  getInitialState() {
    return {};
  },

  componentDidMount() {
    this.marker = this.createMarker();
    this.marker.addListener("click", this._onClick)
    this.marker.addListener("moveover", this._onHover)
  },

  latlng() {
    return new google.maps.LatLng(
      this.props.position.lat,
      this.props.position.lng
    );
  },

  createMarker() {
    return new google.maps.Marker({
      position: this.latlng(),
      icon: "http://utulsa-assets.s3.amazonaws.com/web/static/v1/images/tu_map_icon.png",
      map: this.props.map,
    });
  },

  _onClick() {
  },

  _onHover() {
  },

  render() {
    return null;
  }
});

export default Marker;
