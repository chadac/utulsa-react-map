/**
 * @module Route
 */
import React, {Component, PropTypes} from 'react';
import ItemStateHOC from '../../hoc/ItemStateHOC';

import AppState from '../../constants/AppState';

import gmaps from '../../GMapsAPI';
import InfoWindow from './InfoWindow';

/**
 * React component for routes. These can be any types of paths that appear
 * on the map.
 * @class
 */
class Route extends Component {

  constructor(props) {
    super(props);

    this.state = {
      position: this.props.data.focus.center,
      click: new gmaps.LatLng(0, 0),
    };
  }

  /**
   * Before the component initially renders.
   */
  componentWillMount() {
    this.route = this.createRoute();
    this.route.addListener('click', this._onClick.bind(this));
  }

  /**
   * Before the component unmounts.
   */
  componentWillUnmount() {
    this.route.setMap(null);
  }

  /**
   * Creates an array of gmaps.LatLng objects of the path of the route.
   * @returns {Array.<gmaps.LatLng>} path
   */
  createPathCoordinates() {
    const route = this.props.data.route;
    return route.path.map((coords) => {
      return new gmaps.LatLng(coords.lat, coords.lng);
    })
  }

  /**
   * Creates the route object.
   * @returns {gmaps.PolyLine} route
   */
  createRoute() {
    const route = this.props.data.route;
    return new gmaps.Polyline({
      path: this.createPathCoordinates(),
      geodesic: true,
      strokeColor: route.strokeColor,
      strokeOpacity: route.strokeOpacity,
      strokeWeight: route.strokeWeight,
      map: this.props.map
    });
  }

  /**
   * Renders the component.
   * @returns {ReactElement} route
   */
  render() {
    this.updateRoute();
    let position = this.getPosition();
    return (
      <InfoWindow $infoWindow={this.props.item.$infoWindow}
                  map={this.props.map}
                  position={position}
                  _closeInfoWindow={this.props._closeInfoWindow}>
        <h4>{this.props.data.name}</h4>
        <p>{this.props.data.hours}</p>
      </InfoWindow>
    );
  }

  /**
   * Updates the component based on app and item state.
   */
  updateRoute() {
    const state = this.props.item;
    switch(this.props.appState) {
      case AppState.FILTER:
        if(state.filter.$active) {
          this.route.setMap(this.props.map);
          break;
        }
      case AppState.NORMAL:
        if(!state.filter.$active) {
          this.route.setMap(null);
        }
        else if(state.$zoom === 0) {
          this.route.setMap(this.props.map);
        }
        else {
          this.route.setMap(null);
        }
        break;
      case AppState.SEARCH:
        if(state.search.$active && state.filter.$active) {
          this.route.setMap(this.props.map);
        }
        else {
          this.route.setMap(null);
        }
        break;
    }
  }

  /**
   * Gets the position of where the InfoWindow should be shown (if we
   * are to show it)
   * @returns {gmaps.LatLng} position
   */
  getPosition() {
    let position = null;
    switch(this.props.appState) {
      case AppState.FILTER:
      case AppState.NORMAL:
      case AppState.SEARCH:
        position = this.state.click;
        break;
      case AppState.SELECT:
        position = this.state.position;
        break;
    }
    return position;
  }

  /**
   * Called when route is clicked; opens info window.
   * @param {Event} e The click event.
   */
  _onClick(e) {
    this.setState({click: e.latLng});
    this.props._openInfoWindow(this.props.id);
  }
}

Route.propTypes = {
  // The map object
  map: PropTypes.object.isRequired,

  // Opens the info window.
  _openInfoWindow: PropTypes.func.isRequired,
  // Closes the info window.
  _closeInfoWindow: PropTypes.func.isRequired,

  // Item ID
  id: PropTypes.string.isRequired,
  // App state
  appState: PropTypes.string.isRequired,
  // Item state
  item: PropTypes.object.isRequired,
  // Item data
  data: PropTypes.object.isRequired,
};

export default new ItemStateHOC(Route);
