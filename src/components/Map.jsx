import React, {Component} from 'react'
import shouldPureComponentUpdate from 'react-pure-render/function'
import MarkerStore from '../stores/MarkerStore'
import Marker from './Marker'
import RouteStore from '../stores/RouteStore'
import Route from './Route'
import styles from '../stylesheets/Map.scss'

function getMarkerState() {
  return {
    markers: MarkerStore.getAll()
  }
}

function getRouteState() {
  return {
    routes: RouteStore.getAll()
  }
}

/* class Map extends Component {*/
const Map = React.createClass({
  getDefaultProps() {
    return {
      center: {lat: 36.15159935580428, lng: -95.94644401639404},
      zoom: 16,
      markers: []
    }
  },

  getInitialState() {
    return {
      markers: MarkerStore.getAll(),
      routes: RouteStore.getAll()
    };
  },

  /* shouldComponentUpdate = shouldPureComponentUpdate;*/

  componentDidMount() {
    MarkerStore.addChangeListener(this._onChangeMarker)
    RouteStore.addChangeListener(this._onChangeRoute)
    this.map = this.createMap();
  },

  createMap() {
    let mapOptions = {
      zoom: this.props.zoom,
      center: this.props.center
    }

    return new google.maps.Map(this.refs.map, mapOptions);
  },

  render() {
    const markers = Object.keys(this.state.markers).map((id) => (
      <Marker {...this.state.markers[id]} map={this.map} />
    ));
    const routes = Object.keys(this.state.routes).map((id) => {
      let route = this.state.routes[id];
      return (
        <Route {...route} map={this.map} />
      );
    });
    return (
      <div ref="map" className={styles.Map}>
        {markers}
        {routes}
      </div>
    );
  },

  _onChangeMarker() {
    this.setState(getMarkerState());
  },

  _onChangeRoute() {
    this.setState(getRouteState());
  },
});

export default Map;
