import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import ItemStore from '../../stores/ItemStore';
import AppState from '../../constants/AppState';

import gmaps from '../../GMapsAPI';
import InfoWindow from './InfoWindow';

import styles from '../../stylesheets/Route.scss';

const Route = React.createClass({
  propTypes: {
    route: PropTypes.object.isRequired,
    appState: PropTypes.string.isRequired,

    _openInfoWindow: PropTypes.func.isRequired,
    _closeInfoWindow: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      position: null,
      click: new gmaps.LatLng(0,0),
    };
  },

  componentWillMount() {
    const pos = this.props.route.path[Math.ceil(this.props.route.path.length / 2)];
    this.setState({position: new gmaps.LatLng(pos.lat, pos.lng)});
  },

  componentDidMount() {
    ItemStore.addSelectListener(this.props.id, this._onSelect);

    this.route = this.createRoute();
    this.route.addListener('click', this._onClick);
  },

  componentWillUnmount() {
    this.route.setMap(null);
  },

  createPathCoordinates() {
    return this.props.route.path.map((coords) => {
      return new gmaps.LatLng(coords.lat, coords.lng);
    })
  },

  createInfoWindow() {
    var content = "<h4>" + this.props.name + "</h4>"
                + "<p>" + this.props.address + "</p>"
                + "<p>" + this.props.website + "</p>";
    return new gmaps.InfoWindow({
      content: content
    });
  },

  createRoute() {
    return new gmaps.Polyline({
      path: this.createPathCoordinates(),
      geodesic: true,
      strokeColor: this.props.route.strokeColor,
      strokeOpacity: this.props.route.strokeOpacity,
      strokeWeight: this.props.route.strokeWeight,
      map: this.props.map
    });
  },

  render() {
    let position;
    switch(this.props.appState) {
      case AppState.NORMAL:
      case AppState.SEARCH:
        position = this.state.click;
        break;
      case AppState.SELECT:
        position = this.state.position;
        break;
    }
    return (
      <InfoWindow $infoWindow={this.props.$infoWindow}
                  map={this.props.map}
                  position={position}
                  _closeInfoWindow={this.props._closeInfoWindow}>
        <h4>{this.props.name}</h4>
        <p>{this.props.hours}</p>
      </InfoWindow>
    );
  },

  _onClick(e) {
    this.setState({click: e.latLng});
    this.props._openInfoWindow(this.props.id);
  },

  _onSelect() {
    setTimeout( () => {
      this.props.map.setZoom(17);
      this.props.map.setCenter(this.state.position);
    }, 300);
  },
});

export default Route;
