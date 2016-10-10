import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import gmaps from '../../GMapsAPI';

import InfoWindow from './InfoWindow';

function polyStyles() {
  return {};
}

const ParkingLot = React.createClass({
  propTypes: {
  },

  componentWillMount() {
    this.polys = this._createPolygons();
    const center = this.props.parking_lot.center;
    this.center = new gmaps.LatLng(center.lat, center.lng);
  },

  _createPolygons() {
    const numLayers = this.props.parking_lot.outer_layers.length;
    var polys = []
    for(var i = 0; i < numLayers; i++) {
      var polyStyles = polyStyles();
      polyStyles.paths = [this.props.parking_lot.outer_layers[i]];
      this.props.parking_lot.inner_layers.forEach((layer) => {
        if(layer != "") polyStyles.paths.push(layer);
      });
      var poly = new gmaps.Polygon(polyStyles);
      poly.setMap(this.props.map);
      polys.push(poly);
    }
    return polys;
  },

  componentWillUnmount() {
    this.polys.forEach((poly) => poly.setMap(null));
  },

  render() {
    return (
      <InfoWindow
          $infoWindow={this.props.$infoWindow}
          map={this.props.map}
          position={this.center}>
        <h4>{this.props.name}</h4>
        <p>{this.props.hours}</p>
      </InfoWindow>
    );
  },
});

module.exports = ParkingLot;
