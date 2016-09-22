import React, {Component} from 'react';
import classNames from 'classnames';
import styles from '../stylesheets/Route.scss';
import gmaps from '../GMapsAPI';

const Route = React.createClass({
  componentDidMount() {
    var key = this.props.id;
    this.route = this.createRoute();
  },

  componentWillUnmount() {
    this.route.setMap(null);
  },

  createPathCoordinates() {
    return this.props.route.path.map((coords) => {
      return new gmaps.LatLng(coords.lat, coords.lng);
    })
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
    return null;
  },
});

export default Route;
