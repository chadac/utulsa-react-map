/**
 * @module ParkingLot
 */
import React, {Component, PropTypes} from 'react';
import ItemStateHOC from '../../hoc/ItemStateHOC';

import TextLabel from './TextLabel';

import gmaps from '../../GMapsAPI';
import AppState from '../../constants/AppState';
import InfoWindow from './InfoWindow';

/**
 * Fills in default styles for a series of styles supplied to a polyline.
 * @param {Object} data The manually set styles.
 * @returns {Object} styles
 */
function polyStyles(data) {
  const defaults = {
    strokeColor: "#AAAAAA",
    strokeOpacity: 0.4,
    strokeWeight: 5,
    fillColor: "#FF0000",
    fillOpacity: 0.8,
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
   * Generates all polygons used for 
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
    let position = this.getPosition();

    return (
      <InfoWindow
          $infoWindow={this.props.item.$infoWindow}
          map={this.props.map}
          position={position}
          _closeInfoWindow={this.props._closeInfoWindow}>
        <h4>{this.props.data.name}</h4>
        <p>{this.props.data.hours}</p>
      </InfoWindow>
    );
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
          break;
        }
      case AppState.FILTER:
      case AppState.NORMAL:
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

  /**
   * Returns the position to use for the center.
   * @returns {gmaps.LatLng} center
   */
  getPosition() {
    let position = null;
    switch(this.props.appState) {
      case AppState.NORMAL:
      case AppState.FILTER:
      case AppState.SEARCH:
        position = this.state.clickPos;
        break;
      case AppState.SELECT:
        position = this.center;
        break;
    }
    return position;
  }

  _onClick(e) {
    this.setState({clickPos: e.latLng});
    this.props._openInfoWindow(this.props.id);
  }

}

ParkingLot.propTypes = {
  // The map object.
  map: PropTypes.object.isRequired,

  // Opens the info window.
  _openInfoWindow: PropTypes.func.isRequired,
  // Closes the info window.
  _closeInfoWindow: PropTypes.func.isRequired,

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
