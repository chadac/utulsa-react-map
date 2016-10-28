import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import gmaps from '../../GMapsAPI';

import AppState from '../../constants/AppState';

import InfoWindow from './InfoWindow';

function polyStyles() {
  return {
    strokeColor: "#AAAAAA",
    fillColor: "#FF0000",
    fillOpacity: 0.35,
  };
}

const ParkingLot = React.createClass({
  propTypes: {
  },

  getInitialState() {
    return {
      clickPos: new gmaps.LatLng(0,0),
    };
  },

  componentWillMount() {
    this.polys = this._createPolygons();
    const center = this.props.parking_lot.center;
    this.center = new gmaps.LatLng(center.lat, center.lng);
  },

  _createPolygons() {
    const numLayers = this.props.parking_lot.layer.length;
    var polys = []
    for(var i = 0; i < numLayers; i++) {
      var polyData = polyStyles();
      var layer = this.props.parking_lot.layer[i];
      polyData.paths = layer
        .map((coord) => new gmaps.LatLng(coord.lat, coord.lng));
      var poly = new gmaps.Polygon(polyData);
      poly.setMap(this.props.map);
      poly.addListener('click', this._onClick);
      polys.push(poly);
    }
    return polys;
  },

  componentWillUnmount() {
    this.polys.forEach((poly) => poly.setMap(null));
  },

  render() {
    let position;
    switch(this.props.appState) {
      case AppState.NORMAL:
      case AppState.SEARCH:
      case AppState.FILTER:
        position = this.state.clickPos;
        break;
      case AppState.SELECT:
        position = this.center;
        break;
    }

    return (
      <InfoWindow
          $infoWindow={this.props.$infoWindow}
          map={this.props.map}
          position={position}
          _closeInfoWindow={this.props._closeInfoWindow}>
        <h4>{this.props.name}</h4>
        <p>{this.props.hours}</p>
      </InfoWindow>
    );
  },

  _onClick(e) {
    this.setState({clickPos: e.latLng});
    this.props._openInfoWindow(this.props.id);
  },

});

module.exports = ParkingLot;
