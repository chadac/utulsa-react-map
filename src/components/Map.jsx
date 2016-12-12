import React, {Component} from 'react'

import FluxComponent from '../hoc/FluxComponent';

import gmaps from '../GMapsAPI';

import Place from './map/Place';
import SimpleMarker from './map/SimpleMarker';
import Marker from './map/Marker';
import Route from './map/Route';
import ParkingLot from './map/ParkingLot';
import MapControl from './map/MapControl';

import MenuBar from './menu/MenuBar';

import classnames from 'classnames/bind';
import styles from '../stylesheets/Map.scss'
const cx = classnames.bind(styles);


class Map extends Component {
  constructor(props) {
    super(props);

    this.stores().item.addChangeListener(this._onItemsChanged.bind(this));
    this.stores().app.addChangeListener(this._onAppChanged.bind(this));
    this.stores().gmaps.addMapListener(this._onMapCreate.bind(this));

    this.state = {
      items: this.stores().item.getAll(),
      appState: this.stores().app.getState(),
      map: this.stores().gmaps.getMap(),
    };
  }

  componentDidMount() {
    this.actions().gmaps.createMap(this.refs.map);
  }

  render() {
    if(this.state.map === null) {
      return this.prerender();
    } else {
      return this.postrender();
    }
  }

  prerender() {
    return (
      <div className={cx("map-container")}>
        <div ref="map" className={cx("Map")}></div>
      </div>
    );
  }

  postrender() {
    const mapItems = this.createMapItems();
    return (
      <div className={cx("map-container")}>
        <div ref="map" className={cx("Map")}>
        </div>
        {mapItems}
        <MapControl id="menu" position={gmaps.ControlPosition.LEFT_TOP}
                    map={this.state.map} title="Menu Bar">
          <MenuBar map={this.state.map}
                   items={this.state.items} appState={this.state.appState}
                   {...this.flux()} />
        </MapControl>
      </div>
    );
  }

  createMapItems() {
    const map = this.state.map;
    const mapItems = this
      .state.items
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
          <MapItem
              key={item.id} map={map} id={item.id}
              data={item} appState={this.state.appState}
              _register={this.stores().item.addStateChangeListener.bind(this.stores().item)}
              _getItemState={this.stores().item.getItemState.bind(this.stores().item)}
              _select={this.actions().item.select}
              _openInfoWindow={this.actions().item.openInfoWindow}
              _closeInfoWindow={this.actions().item.closeInfoWindow} />
        );
      });

    if(this.state.user) {
      mapItems.push((
        <Marker map={map} key="user_position" id="user_position" latLng={this.state.user} />
      ));
    }

    return mapItems;
  }

  _onItemsChanged() {
    this.setState({
      items: this.stores().item.getItems(),
    });
  }

  _onAppChanged() {
    this.setState({
      appState: this.stores().app.getState(),
    });
  }

  _onMapCreate(map) {
    this.setState({map: map});
  }
}

Map.propTypes = {};

export default FluxComponent(Map);
