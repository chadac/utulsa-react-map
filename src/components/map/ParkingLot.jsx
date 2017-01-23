/**
 * @module ParkingLot
 */
import {Component, PropTypes} from 'react';
import ItemStateHOC from '../../hoc/ItemStateHOC';

import TextLabel from './TextLabel';

import gmaps from '../../GMapsAPI';
import AppState from '../../constants/AppState';

/**
 * Fills in default styles for a series of styles supplied to a polyline.
 * @param {Object} data The manually set styles.
 * @returns {Object} styles
 */
function polyStyles(data) {
  const defaults = {
    strokeColor: "#AAA",
    strokeOpacity: 1.0,
    strokeWeight: 2,
    fillColor: "#F00",
    fillOpacity: 0.7,
  };
  let styles = {};
  Object.keys(defaults)
        .forEach((key) => styles[key] = data[key] || defaults[key]);
  return styles;
}

/**
 * React component for parking lots.
 * @class
 */
class ParkingLot extends Component {

  constructor(props) {
    super(props);

    this.state = {
      clickPos: new gmaps.LatLng(0, 0),
    };
  }

  /**
   * Before the component is rendered.
   */
  componentWillMount() {
    this.polys = this._createPolygons();
    // The center is used for label placement
    const center = this.props.data.parking_lot.center;
    this.center = new gmaps.LatLng(center.lat, center.lng);

    // TODO: https://gitlab.utulsa.co/chad/react-tu-map/issues/1
    this.label = new TextLabel(this.center, this.props.data.name, this.props.map);
    this.label.setMap(null);
  }

  /**
   * Generates all polygons used for parking lots.
   * @returns {Array.<gmaps.Polygon>} Array of polygons.
   */
  _createPolygons() {
    // Parking lot data
    const lot = this.props.data.parking_lot;
    // The number of polygons
    const numLayers = lot.layer.length;
    var polys = [];
    for(var i = 0; i < numLayers; i++) {
      var polyData = polyStyles(lot);
      // This layer
      var layer = lot.layer[i];
      polyData.paths = [
        layer.map((coord) => new gmaps.LatLng(coord.lat, coord.lng)),
      ];
      var poly = new gmaps.Polygon(polyData);
      poly.setMap(this.props.map);
      poly.addListener('click', this._onClick.bind(this));
      polys.push(poly);
    }
    return polys;
  }

  /**
   * Displays polygons on the map.
   */
  showPolygons() {
    this.polys.forEach((poly) => {
      if(poly.getMap() !== this.props.map)
        poly.setMap(this.props.map)
    });
  }

  /**
   * Hides polygons on the map.
   */
  hidePolygons() {
    this.polys.forEach((poly) => {
      if(poly.getMap() !== null)
        poly.setMap(null)
    });
  }

  /**
   * Highlights the polygons (used for selection)
   */
  highlight() {
    this.polys.forEach((poly) => {
      poly.setOptions({strokeColor: "#CC0", strokeWeight: 3});
    });
  }

  /**
   * Unhighlights the polygons
   */
  unhighlight() {
    this.polys.forEach((poly) => {
      poly.setOptions({strokeColor: "#AAA", strokeWeight: 2});
    });
  }

  /**
   * Before the component unmounts.
   */
  componentWillUnmount() {
    this.hidePolygons();
  }

  /**
   * Renders parking lots.
   * @returns {ReactElement} parkingLot
   */
  render() {
    this.updatePoly();

    return null;
  }

  /**
   * Updates the polygon data based on item and app state.
   */
  updatePoly() {
    const state = this.props.item;

    switch(this.props.appState) {
      case AppState.SELECT:
        if(state.$selected) {
          this.showPolygons();
          this.highlight();
          break;
        }
      case AppState.FILTER:
      case AppState.NORMAL:
        this.unhighlight();
        if(!state.filter.$active) {
          this.hidePolygons();
        }
        else if(state.$zoom === 0) {
          this.showPolygons();
        }
        else {
          this.hidePolygons();
        }
        break;
      case AppState.SEARCH:
        if(state.search.$active) {
          this.showPolygons();
        }
        else {
          this.hidePolygons();
        }
    }
  }

  _onClick() {
    this.props._select(this.props.id);
  }

}

ParkingLot.propTypes = {
  // The map object.
  map: PropTypes.object.isRequired,

  // Select function
  _select: PropTypes.func.isRequired,

  // The item ID
  id: PropTypes.string.isRequired,
  // The app state
  appState: PropTypes.string.isRequired,
  // Item state
  item: PropTypes.object.isRequired,
  // Item data
  data: PropTypes.object.isRequired,
};

export default new ItemStateHOC(ParkingLot);
