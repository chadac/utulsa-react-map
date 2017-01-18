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
              _select={this.props._select} />
    );
  }
}

SimpleMarker.propTypes = {
  // The map object.
  map: PropTypes.object.isRequired,

  // Selects the item in the Item Store.
  _select: PropTypes.func.isRequired,

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
