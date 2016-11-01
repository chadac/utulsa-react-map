import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom';

import GMapsStore from '../../stores/GMapsStore';

import AppState from '../../constants/AppState';

import Place from './Place';
import SimpleMarker from './SimpleMarker';
import Marker from './Marker';
import Route from './Route';
import ParkingLot from './ParkingLot';
import CenterControl from './CenterControl';
import FilterMenu from './FilterMenu';

import styles from '../../stylesheets/Map.scss'
import gmaps from '../../GMapsAPI';

const Map = React.createClass({
  propTypes: {
    center: PropTypes.object.isRequired,
    zoom: PropTypes.number.isRequired,
    items: PropTypes.array.isRequired,
    appState: PropTypes.string.isRequired,
    _onZoom: PropTypes.func.isRequired,
    _onCenter: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      rendered: false,
    };
  },

  componentDidMount() {
    this.map = this.createMap();
    this.map.addListener("center_changed", this._onMapCenter);
    this.map.addListener("zoom_changed", this._onMapZoom);
    this.setState({rendered: true});
    GMapsStore.addCenterListener(this._centerChanged);
    GMapsStore.addZoomListener(this._zoomChanged);
    GMapsStore.addUserPositionListener(this._userPositionSet);
  },

  createMap() {
    let mapOptions = {
      zoom: this.props.zoom,
      center: this.props.center,
      styles: [
        {
          featureType: 'poi',
          stylers: [{visibility: "off"}],
        },
      ],
    }
    return new gmaps.Map(this.refs.map, mapOptions);
  },

  render() {
    if(this.state.rendered) {
      const map = this.map;
      const items = this
        .props.items
        .filter((item) => {
          switch(this.props.appState) {
            case AppState.NORMAL:
              return item.$inZoom;
            case AppState.SELECT:
              return item.$selected || item.$inZoom;
            case AppState.SEARCH:
              return true;
          }
          return true;
        })
        .map((item) => {
          var MapItem;
          switch(item.type) {
            case "place":
              MapItem = Place;
              break;
            case "simple_marker":
              MapItem = SimpleMarker;
              break;
            case "route":
              MapItem = Route;
              break;
            case "parking_lot":
              MapItem = ParkingLot;
              break;
          }
          return (
            <MapItem key={item.id} map={map} {...item}
                     appState={this.props.appState}
                     _openInfoWindow={this.props._openInfoWindow}
                     _closeInfoWindow={this.props._closeInfoWindow}
                     _focus={this.props._focus} />
          );
        });
      if(this.state.user) {
        items.push((
          <Marker map={map} key="user_position" id="user_position" latLng={this.state.user} />
        ));
      }
      return (
        <div className={styles.mapContainer}>
          <div ref="map" className={styles.Map}>
          </div>
          <FilterMenu map={map}
                      categories={this.props.categories}
                      activeCategories={this.props.activeCategories}
                      _addCategory={this.props._addCategory}
                      _remCategory={this.props._remCategory} />
          <CenterControl map={map}
                         _setUserPosition={this.props._setUserPosition} />
          {items}
        </div>
      );
    } else {
      return (
        <div className={styles.mapContainer}>
          <div ref="map" className={styles.Map}></div>
        </div>
      );
    }
  },

  _onChange() {
    this.setState(getItemState());
  },

  _onMapCenter() {
    const center = this.map.getCenter();
    if(center != null) this.props._onCenter(center.lat(), center.lng());
  },

  _onMapZoom() {
    const zoom = this.map.getZoom();
    this.props._onZoom(zoom);
  },

  _centerChanged(lat, lng) {
    this.map.setCenter(new gmaps.LatLng(lat, lng));
  },

  _zoomChanged(zoomLevel) {
    this.map.setZoom(zoomLevel);
  },

  _userPositionSet(lat, lng) {
    this.setState({user: new gmaps.LatLng(lat, lng)});
  },
});

export default Map;
