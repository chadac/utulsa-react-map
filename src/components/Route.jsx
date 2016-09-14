import React, {Component} from 'react';
import RouteStore from '../stores/RouteStore';
import RouteActions from '../actions/RouteActions';
import classNames from 'classnames';
import styles from '../stylesheets/Route.scss';

const Route = React.createClass({
  componentDidMount() {
    var key = this.props.id;
    this.route = this.createRoute();
  },

  componentWillUnmount() {
    this.route.setMap(null);
  },

  createPathCoordinates() {
    return this.props.coordinates.map((coords) => {
      return new google.maps.LatLng(coords.lat, coords.lng);
    })
  },

  createRoute() {
    return new google.maps.Polyline({
      path: this.createPathCoordinates(),
      geodesic: true,
      strokeColor: this.props.strokeColor,
      strokeOpacity: this.props.strokeOpacity,
      strokeWeight: this.props.strokeWeight,
      map: this.props.map
    });
  },

  render() {
    return null;
  },
});

export default Route;
