import React, {Component, PropTypes} from 'react'

import FluxComponent from '../../hoc/FluxComponent';

import Place from './Place';
import SimpleMarker from './SimpleMarker';
import Marker from './Marker';
import Route from './Route';
import ParkingLot from './ParkingLot';
//import CenterControl from './CenterControl';
//import FilterMenu from './FilterMenu';

import classnames from 'classnames/bind';
import styles from '../../stylesheets/Map.scss'
const cx = classnames.bind(styles);

import gmaps from '../../GMapsAPI';

class Map extends Component {
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
      center: this.props.center,
      zoom: this.props.zoom,
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
      const mapItems = this
        .props.items
        .map((item) => {
          var MapItem = null;
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
            <MapItem key={item.id} map={map} id={item.id}
                     data={item} appState={this.props.appState}
                     _register={this.stores().item.addStateChangeListener.bind(this.stores().item)}
                     _getItemState={this.stores().item.getItemState.bind(this.stores().item)}
                     _openInfoWindow={this.actions().item.openInfoWindow}
                     _closeInfoWindow={this.actions().item.closeInfoWindow} />
          );
        });
      if(this.state.user) {
        mapItems.push((
          <Marker map={map} key="user_position" id="user_position" latLng={this.state.user} />
        ));
      }
      return (
        <div className={cx("map-container")}>
          <div ref="map" className={cx("Map")}>
          </div>
          {mapItems}
        </div>
      );
    } else {
      return (
        <div className={cx("map-container")}>
          <div ref="map" className={cx("Map")}></div>
        </div>
      );
    }
  }

  _onMapCenter() {
    const center = this.map.getCenter();
    if(center !== null) this.actions().gmaps.center(center.lat(), center.lng());
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

Map.propTypes = {
  center: PropTypes.object.isRequired,
  zoom: PropTypes.number.isRequired,
  appState: PropTypes.string.isRequired,

  items: PropTypes.array.isRequired,
};

export default FluxComponent(Map);
