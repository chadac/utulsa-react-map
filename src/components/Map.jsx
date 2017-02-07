/**
 * The main map controller.
 *
 * @module Map
 */

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


/**
 * The map controller module. Mounts the google map object into
 * the DOM and controls all sub-components.
 * @class
 */
class Map extends Component {
  constructor(props) {
    super(props);

    /* Flux event listeners */
    // Called when an item is added or removed.
    this.stores().item.addChangeListener(this._onItemsChanged.bind(this));
    // Called when a category is added or removed
    this.stores().item.addCategoryChangeListener(this._onCategoriesChanged.bind(this));
    // Called when the app state is changed
    this.stores().app.addChangeListener(this._onAppChanged.bind(this));
    // Called when the Google Map has been created. (promting a re-render)
    this.stores().gmaps.addMapListener(this._onMapCreate.bind(this));

    window.addEventListener('resize', this.updateDimensions.bind(this));

    this.state = {
      items: this.stores().item.getAll(),
      cats: this.stores().item.getCategories(),
      activeCats: this.stores().item.getActiveCategories(),
      appState: this.stores().app.getState(),
      map: this.stores().gmaps.getMap(),
      dims: {width: 0, height: 0}
    };
  }

  /**
   * After component first render.
   */
  componentDidMount() {
    // This creates the Google Map using an empty div created
    // on the initial render step.
    this.actions().gmaps.createMap(this.refs.map);
    setTimeout(this.updateDimensions.bind(this), 500);
  }

  /**
   * @param {boolean} updateState - If true, updates the container state (default: true).
   */
  updateDimensions() {
    let container = this.refs.container;
    let dims = {width: container.clientWidth, height: container.clientHeight};
    this.setState({dims: dims});
  }

  /**
   * Render step.
   * @return {ReactElement} map
   */
  render() {
    // Checks for if the map has been created or not.
    if(this.state.map === null) {
      return this.prerender();
    } else {
      return this.postrender();
    }
  }

  /**
   * Render step for when the Google Maps object has not been created yet.
   * Creates an empty div that will be populated upon Google Maps init.
   * @return {ReactElement} map
   */
  prerender() {
    return (
      <div className={cx("map-container")} ref="container">
        <div ref="map" className={cx("Map")}></div>
      </div>
    );
  }

  /**
   * Render step for when the Google Maps object has been created. Creates all
   * markers and the menu for the map.
   * @return {ReactElement} map
   */
  postrender() {
    const mapItems = this.createMapItems();
    return (
      <div className={cx("map-container")} ref="container">
        <div ref="map" className={cx("Map")}>
        </div>
        {mapItems}
        <MapControl id="menu" position={gmaps.ControlPosition.LEFT_TOP}
                    map={this.state.map} dims={this.state.dims}>
          <MenuBar map={this.state.map} dims={this.state.dims}
                   items={this.state.items} appState={this.state.appState}
                   cats={this.state.cats} activeCats={this.state.activeCats}
                   {...this.flux()} />
        </MapControl>
      </div>
    );
  }

  /**
   * Returns a list of React components created from items in the Item Store.
   * These will become markers on the Google Map.
   * @return {Array.<ReactComponent>} mapItems
   */
  createMapItems() {
    const map = this.state.map;
    const mapItems = this
      .state.items
      .map((item) => {
        var MapItem = null;
        // Conditionally map to marker class based on item type.
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
              _select={this.actions().item.select} />
        );
      });

    // If there is a user position set, create a marker for this as well.
    if(this.state.user) {
      mapItems.push((
        <Marker map={map} key="user_position" id="user_position" latLng={this.state.user} />
      ));
    }

    return mapItems;
  }

  /**
   * Called when items are added or destroyed. Updates the state to reflect
   * this change.
   * @return {void}
   */
  _onItemsChanged() {
    this.setState({
      items: this.stores().item.getItems(),
    });
  }

  /**
   * Called when categories are added or destroyed. Updaates the state for
   * categories and active categories. (for filtering)
   * @return {void}
   */
  _onCategoriesChanged() {
    this.setState({
      cats: this.stores().item.getCategories(),
      activeCats: this.stores().item.getActiveCategories(),
    });
  }

  /**
   * Called when the app state is changed. Updates the state.
   * @return {void}
   */
  _onAppChanged() {
    this.setState({
      appState: this.stores().app.getState(),
    });
  }

  /**
   * Called when the map is created. Updates the state to have the Google Map
   * object, which is used in various places.
   * @param {Google.Map} map The map object
   * @return {void}
   */
  _onMapCreate(map) {
    this.setState({map: map});
  }
}

Map.propTypes = {};

export default FluxComponent(Map);
