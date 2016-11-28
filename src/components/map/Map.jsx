import React, {Component, PropTypes} from 'react'

import FluxComponent from '../../hoc/FluxComponent';

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

class Map extends Component {
  static propTypes = {
    initialCenter: PropTypes.object.isRequired,
    initialZoom: PropTypes.number.isRequired,
    items: PropTypes.array.isRequired,
    appState: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      rendered: false,
    };
  }

  componentDidMount() {
    this.map = this.createMap();
    this.map.addListener("center_changed", this._onMapCenter.bind(this));
    this.map.addListener("zoom_changed", this._onMapZoom.bind(this));
    this.setState({rendered: true});
    this.stores().gmaps.addCenterListener(this._centerChanged.bind(this));
    this.stores().gmaps.addZoomListener(this._zoomChanged.bind(this));
    this.stores().gmaps.addUserPositionListener(this._userPositionSet.bind(this));
  }

  createMap() {
    let mapOptions = {
      zoom: this.props.initialZoom,
      center: this.props.initialCenter,
      styles: [
        {
          featureType: 'poi',
          stylers: [{visibility: "off"}],
        },
      ],
    }
    return new gmaps.Map(this.refs.map, mapOptions);
  }

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
                     _openInfoWindow={this.actions().item.openInfoWindow}
                     _closeInfoWindow={this.actions().item.closeInfoWindow}
                     _focus={this.actions().item.focus} />
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
                      _addCategory={this.actions().item.addCategory}
                      _remCategory={this.actions().item.remCategory} />
          <CenterControl map={map}
                         _setUserPosition={this.actions().gmaps.setUserPosition} />
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
  }

  _onChange() {
    this.setState(getItemState());
  }

  _onMapCenter() {
    const center = this.map.getCenter();
    if(center != null) this.actions().gmaps.center(center.lat(), center.lng());
  }

  _onMapZoom() {
    const zoom = this.map.getZoom();
    this.actions().gmaps.zoom(zoom);
  }

  _centerChanged(lat, lng) {
    this.map.setCenter(new gmaps.LatLng(lat, lng));
  }

  _zoomChanged(zoomLevel) {
    this.map.setZoom(zoomLevel);
  }

  _userPositionSet(lat, lng) {
    this.setState({user: new gmaps.LatLng(lat, lng)});
  }
}

export default FluxComponent(Map);
