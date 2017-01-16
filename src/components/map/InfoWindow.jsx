/**
 * @module InfoWindow
 */
import React, {Component, PropTypes} from 'react';

import gmaps from '../../GMapsAPI';

/**
 * The InfoWindow is a Google Maps object that places an information
 * box at a certain latitude/longitude position. More info is available at:
 *
 *   https://developers.google.com/maps/documentation/javascript/infowindows
 *
 * This React wrapper will update the InfoWindow by copying any children
 * content into the Google Maps InfoWindow object.
 * @class
 */
class InfoWindow extends Component {
  /**
   * Before the component mounts.
   * @return {void}
   */
  componentWillMount() {
    // Create the Google Maps InfoWindow object.
    this.info = new gmaps.InfoWindow();
    this.info.addListener("closeclick", this._onCloseInfoWindow.bind(this));
  }

  /**
   * Before the component unmounts.
   * @return {void}
   */
  componentWillUnmount() {
    // Close the infowindow
    this.info.close();
  }

  /**
   * React render step. Creates a hidden div that contains all inside content,
   * that will be copied into the InfoWindow whenever the inner content is
   * changed.
   * @return {void}
   */
  render() {
    return (
      <div style={{display: "none"}}>
        <div ref={c => this.infoWindowContent = c}>
          {this.props.children}
        </div>
      </div>
    );
  }

  /**
   * Update step. Follows every render step except the initial render. Copies
   * the content of the rendered component into the info window object.
   * @returns {void}
   */
  componentDidUpdate() {
    // Copy content into info window object.
    this.info.setContent(this.infoWindowContent);
    if(this.props.$infoWindow) { // If the info window should appear
      // Currently receives two potential position types: a gmaps.LatLng
      // object and a dictionary of the form {lat: x, lng: y}. Need to
      // handle both cases.
      if(this.props.position instanceof gmaps.LatLng) {
        this.info.setOptions({position: this.props.position});
        this.info.open(this.props.map);
      } else {
        this.info.open(this.props.map, this.props.position);
      }
    } else { // Otherwise, remove it from the map.
      this.info.close();
    }
  }

  /**
   * Updates the info window state in the ItemStore.
   * @returns {void}
   */
  _onCloseInfoWindow() {
    this.props._closeInfoWindow();
  }
}

InfoWindow.propTypes = {
  // True if the info window should appear on the map.
  $infoWindow: PropTypes.bool.isRequired,
  // The map object, which the info window object needs
  map: PropTypes.object.isRequired,
  // The position of the info window
  position: PropTypes.object.isRequired,

  // A method that will update the item state so that its info window is closed.
  _closeInfoWindow: PropTypes.func,
};

module.exports = InfoWindow;
