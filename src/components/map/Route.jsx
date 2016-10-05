import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import ItemActions from '../../actions/ItemActions';

import gmaps from '../../GMapsAPI';
import InfoWindow from './InfoWindow';

import styles from '../../stylesheets/Route.scss';


const Route = React.createClass({
  propTypes: {
    route: PropTypes.object.isRequired,

    _openInfoWindow: PropTypes.func.isRequired,
    _closeInfoWindow: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      click: new gmaps.LatLng(0,0),
    };
  },

  componentDidMount() {
    var key = this.props.id;
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
    return (
      <InfoWindow $infoWindow={this.props.$infoWindow}
                  map={this.props.map} position={this.state.click}
                  _closeInfoWindow={ItemActions.closeInfoWindow}>
        <h4>{this.props.name}</h4>
        <p>{this.props.hours}</p>
      </InfoWindow>
    );
  },

  _onClick(e) {
    this.setState({click: e.latLng});
    this.props._openInfoWindow(this.props.id);
  },
});

export default Route;
