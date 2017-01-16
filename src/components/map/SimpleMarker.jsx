/**
 * @module SimpleMarker
 */
import React, {Component, PropTypes} from 'react';
import ItemStateHOC from '../../hoc/ItemStateHOC';

import gmaps from '../../GMapsAPI';
import Marker from './Marker';

/**
 * Simple marker that doesn't need a label.
 * @class
 */
class SimpleMarker extends Component {

  /**
   * Converts coordinates into the google maps format.
   * @returns {gmaps.LatLng} coords
   */
  latLng() {
    return new gmaps.LatLng(
      this.props.data.marker.lat,
      this.props.data.marker.lng
    );
  }

  /**
   * Renders the marker.
   * @returns {ReactElement} simpleMarker
   */
  render() {
    return (
      <Marker map={this.props.map} id={this.props.id} item={this.props.item}
              appState={this.props.appState}
              latLng ={this.latLng()} icon={this.props.data.marker.icon}
              _select={this.props._select}
              _openInfoWindow={this.props._openInfoWindow}
              _closeInfoWindow={this.props._closeInfoWindow}>
        <h4>{this.props.data.label}</h4>
      </Marker>
    );
  }
}

SimpleMarker.propTypes = {
  // The map object.
  map: PropTypes.object.isRequired,

  // Selects the item in the Item Store.
  _select: PropTypes.func.isRequired,
  // Opens the info window for the item.
  _openInfoWindow: PropTypes.func.isRequired,
  // Closes the info window for the item.
  _closeInfoWindow: PropTypes.func.isRequired,

  // The item ID
  id: PropTypes.string.isRequired,
  // The application state
  appState: PropTypes.string.isRequired,
  // The item state
  item: PropTypes.object.isRequired,
  // The item data
  data: PropTypes.object.isRequired,
}

export default new ItemStateHOC(SimpleMarker);
