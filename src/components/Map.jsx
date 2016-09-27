import React, {Component, PropTypes} from 'react'
import shouldPureComponentUpdate from 'react-pure-render/function'
import ItemStore from '../stores/ItemStore'
import ItemActions from '../actions/ItemActions'
import Marker from './Marker'
import Route from './Route'
import styles from '../stylesheets/Map.scss'
import gmaps from '../GMapsAPI';

const Map = React.createClass({
  propTypes: {
    center: PropTypes.object.isRequired,
    zoom: PropTypes.number.isRequired,
    markers: PropTypes.array.isRequired,
    routes: PropTypes.array.isRequired,
    _onZoom: PropTypes.func.isRequired,
    _onCenter: PropTypes.func.isRequired,
  },

  componentDidMount() {
    this.map = this.createMap();
    this.map.addListener("center_changed", this._onMapCenter);
    this.map.addListener("zoom_changed", this._onMapZoom);
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
      .props.markers
      .filter((marker) => marker.$inZoom)
      .map((marker) => (
        <Marker key={marker.id} {...marker} map={map} />
      ));
    const routes = this
      .props.routes
      .filter((route) => route.$inZoom)
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

  _onMapCenter() {
    const center = this.map.getCenter();
    this.props._onCenter(center.lat, center.lng);
  },

  _onMapZoom() {
    const zoom = this.map.getZoom();
    this.props._onZoom(zoom);
  }

});

export default Map;
