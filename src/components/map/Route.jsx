/**
 * @module Route
 */
import {Component, PropTypes} from 'react';
import ItemStateHOC from '../../hoc/ItemStateHOC';

import AppState from '../../constants/AppState';

import gmaps from '../../GMapsAPI';

/**
 * React component for routes. These can be any types of paths that appear
 * on the map.
 * @class
 */
class Route extends Component {

  constructor(props) {
    super(props);
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
   * "Highlights" the route (used for selection)
   */
  highlight() {
    let route = this.props.data.route;
    this.route.setOptions({strokeWeight: route.strokeWeight + 2});
  }

  /**
   * "Highlights" the route (used for selection)
   */
  unhighlight() {
    let route = this.props.data.route;
    this.route.setOptions({strokeWeight: route.strokeWeight});
  }

  /**
   * Renders the component.
   * @returns {ReactElement} route
   */
  render() {
    this.updateRoute();
    return null;
  }

  /**
   * Updates the component based on app and item state.
   */
  updateRoute() {
    const state = this.props.item;
    switch(this.props.appState) {
      case AppState.SELECT:
        if(state.$selected) {
          this.route.setMap(this.props.map);
          this.highlight();
          break;
        }
        else {
          this.unhighlight();
        }
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
   * Called when route is clicked; opens info window.
   * @param {Event} e The click event.
   */
  _onClick() {
    this.props._select(this.props.id);
  }
}

Route.propTypes = {
  // The map object
  map: PropTypes.object.isRequired,

  // Select function
  _select: PropTypes.func.isRequired,

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
