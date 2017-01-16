/**
 * General class for rendering a marker on the map.
 * @module Marker
 */
import React, {Component, PropTypes} from 'react';

import gmaps from '../../GMapsAPI';
import AppState from '../../constants/AppState';

import InfoWindow from './InfoWindow';
import MapIcon from '../../data/mapIcons.json';

class Marker extends Component {
  componentWillMount() {
    this.marker = this.createMarker();
    this.marker.addListener("click", this._onClick.bind(this));
  }

  componentWillUnmount() {
    this.marker.setMap(null);
  }

  createMarker() {
    let icon = null;
    if(this.props.icon) {
      icon = {
        url: MapIcon[this.props.icon],
        scaledSize: new gmaps.Size(32, 32),
      };
    }
    const marker = new gmaps.Marker({
      position: this.props.latLng,
      icon: icon,
      draggable: false,
      map: this.props.map,
    });
    this.setState({zIndex: marker.getZIndex()});
    return marker;
  }

  /**
   * Shows the marker on the map.
   * @returns {void}
   */
  showMarker() {
    // Slight speedup: calling setMap alone slows down things,
    // so I check to see if the marker is already on the map.
    if(this.marker.getMap() !== this.props.map)
      this.marker.setMap(this.props.map);
  }

  /**
   * Hides the marker from the map.
   * @returns {void}
   */
  hideMarker() {
    if(this.marker.getMap() !== null)
      this.marker.setMap(null);
  }

  /**
   * Resizes the marker icon. Currently creates only square sizes.
   * @param {int} size The new size of the icon.
   * @returns {void}
   */
  resizeMarker(size) {
    this.marker.setIcon({
      url: MapIcon[this.props.icon],
      scaledSize: new gmaps.Size(size, size)
    });
  }

  render() {
    this.updateMarker();

    // Creates a corresponding InfoWindow if the marker has additional content.
    if(this.props.children && this.props._openInfoWindow) {
      return (
        <InfoWindow
            map={this.props.map}
            $infoWindow={this.props.item.$infoWindow}
            position={this.marker}
            _closeInfoWindow={this.props._closeInfoWindow}>
          {this.props.children}
        </InfoWindow>
      );
    }
    else {
      return null;
    }
  }

  componentDidUpdate() {
    this.marker.setPosition(this.props.latLng);
  }

  /**
   * Updates the marker object on re-rendering.
   * @returns {void}
   */
  updateMarker() {
    // The current item state.
    const state = this.props.item;
    // The current app state.
    const appState = this.props.appState;

    // Conditional that changes the appearance of the marker based on
    // item and app state.
    // NOTE: I actually manipulate the break statement to reduce the
    //       amount of code; pay attention to where break statements appear.
    switch(appState) {
      case AppState.SELECT:
        if(state.$selected) {
          this.showMarker();
          this.resizeMarker(38, 38);
          this.marker.setZIndex(3);
          break;
        }
      case AppState.FILTER:
      case AppState.NORMAL:
        if(!state.filter.$active) {
          this.hideMarker();
        }
        else if(state.$zoom === 0) {
          this.showMarker();
          this.resizeMarker(32, 32);
          this.marker.setZIndex(2);
        }
        else if(state.$zoom > 0) {
          this.showMarker();
          this.resizeMarker(10, 10);
          this.marker.setZIndex(1);
        }
        else {
          this.hideMarker();
        }
        break;
      case AppState.SEARCH:
        if(state.search.$active && state.filter.$active) {
          this.showMarker();
          this.resizeMarker(32, 32);
        }
        else {
          // this.resizeMarker(8, 8);
          this.hideMarker();
        }
        break;
    }
  }

  /**
   * Called when the marker is clicked. If the class has been passed a
   * method for opening an infowindow, then select this item.
   * @returns {void}
   */
  _onClick() {
    if(this.props._openInfoWindow)
      this.props._select(this.props.id);
  }
}

Marker.propTypes = {
  // the map object
  map: PropTypes.object.isRequired,

  // selects the item in the ItemStore
  _select: PropTypes.func.isRequired,
  // opens the infowindow for the item in the ItemStore
  _openInfoWindow: PropTypes.func,
  // closes the infowindow for the item in the ItemStore
  _closeInfoWindow: PropTypes.func,

  // The ID of the marker
  id: PropTypes.string.isRequired,
  // The position of the marker (as a gmaps.LatLng object)
  latLng: PropTypes.object.isRequired,
  // The current app state
  appState: PropTypes.string.isRequired,
  // The item state
  item: PropTypes.object.isRequired,
  // The item icon
  icon: PropTypes.string.isRequired,
};

export default Marker;
