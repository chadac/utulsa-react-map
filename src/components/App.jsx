import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Map from './Map'
import styles from '../stylesheets/App.scss'
import MarkerActions from '../actions/MarkerActions'
import RouteActions from '../actions/RouteActions'
var routes = require('../data/routes.json')

const App = React.createClass({
  getDefaultProps() {
    return {
      center: {lat: 36.15159935580428, lng: -95.94644401639404},
      zoom: 16
    };
  },

  _fetchPlaces() {
    fetch('http://calendar.utulsa.edu/api/2/places?pp=100')
      .then( function(response) {
        return response.json();
      })
      .then( function(data) {
        data.places.map((place) => place.place)
            .filter((place) => place.geo.latitude != null &&
                             place.geo.longitude != null)
            .map((place) => { return {
              key: place.id,
              id: place.id,
              name: place.name,
              position: { lat: place.geo.latitude, lng: place.geo.longitude },
              address: place.address,
              website: place.url,
              phone: place.phone,
              hours: place.hours
            }})
            .forEach((place) => {
              MarkerActions.create(place);
            });
      })
      .catch( function(err) {
        console.log(err);
        return null;
      });
  },

  componentDidMount() {
    this._fetchPlaces();
    routes.forEach((route) => RouteActions.create(route));
  },

  render() {
    return (
      <div className={styles.App}>
        <Map
        />
      </div>
    );
  }
});

export default App;
