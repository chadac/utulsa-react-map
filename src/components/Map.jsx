import React, {Component} from 'react'
import shouldPureComponentUpdate from 'react-pure-render/function'
import ItemStore from '../stores/ItemStore'
import ItemActions from '../actions/ItemActions'
import Marker from './Marker'
import Route from './Route'
import styles from '../stylesheets/Map.scss'
import gmaps from '../GMapsAPI';

function getItemState() {
  return {
    markers: ItemStore.getMarkers(),
    routes: ItemStore.getRoutes()
  }
}

const Map = React.createClass({

  getDefaultProps() {
    return {
      center: {lat: 36.15159935580428, lng: -95.94644401639404},
      zoom: 16,
      markers: []
    };
  },

  getInitialState() {
    return {
      markers: [],
      routes: [],
      zoom: 0,
      center: {lat: 0, lng: 0}
    };
  },

  componentDidMount() {
    ItemStore.addChangeListener(this._onChange);
    this.map = this.createMap();
    this.map.addListener("center_changed", this._onMapCenterChange);
    this.map.addListener("zoom_changed", this._onMapZoomChange);
    this.setState(getItemState());
  },

  updateActiveItems() {
    const ids = ItemStore
      .getAll()
      .filter((item) => {
        return this.state.zoom >= item.gmaps.min_zoom
      })
      .map((item) => item.id);
    ItemActions.marksActive(ids);
  },

  createMap() {
    let mapOptions = {
      zoom: this.props.zoom,
      center: this.props.center
    }
    return new gmaps.Map(this.refs.map, mapOptions);
  },

  render() {
    const map = this.map;
    const markers = this
      .state.markers
      .filter((marker) => marker.$active)
      .map((marker) => (
        <Marker key={marker.id} {...marker} map={map} />
      ));
    const routes = this
      .state.routes
      .filter((route) => route.$active)
      .map((route) => (
        <Route key={route.id} {...route} map={map} />
      ));
    return (
      <div ref="map" className={styles.Map}>
        {markers}
        {routes}
      </div>
    );
  },

  _onChange() {
    this.setState(getItemState());
  },

  _onMapCenterChange() {
    this.setState({
      center: this.map.getCenter()
    });
  },

  _onMapZoomChange() {
    this.setState({
      zoom: this.map.getZoom()
    });
    this.updateActiveItems();
  },

});

export default Map;
