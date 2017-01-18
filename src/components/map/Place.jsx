/**
 * Class for drawing places on the Google Map.
 * @module Place
 */
import React, {Component, PropTypes} from 'react';
import ItemStateComponent from '../../hoc/ItemStateHOC';

import AppState from '../../constants/AppState';
import gmaps from '../../GMapsAPI';

import Marker from './Marker';
import TextLabel from './TextLabel';

/**
 * Class for the place component.
 * @class
 */
class Place extends Component {
  /**
   * Before the component mounts.
   */
  componentWillMount() {
    this.label = this.createLabel();
  }

  /**
   * Before the component unmounts.
   */
  componentWillUnmount() {
    // Remove the label from the map if it is being displayed.
    if(this.label)
      this.label.setMap(null);
  }

  /**
   * Creates a label object if the React component has a name.
   * @returns {TextLabel|null} label
   */
  createLabel() {
    if(typeof this.props.data.name !== "undefined") {
      let label = new TextLabel(this.latLng(), this.props.data.name, this.props.map);
      return label;
    }
    else {
      return null;
    }
  }

  /**
   * Displays the label on the map.
   */
  showLabel() {
    if(this.label.getMap() !== this.props.map)
      this.label.setMap(this.props.map);
  }

  /**
   * Hides the label.
   */
  hideLabel() {
    if(this.label.getMap() !== null)
      this.label.setMap(null);
  }

  /**
   * Generates the coordinates of the marker object in the google maps format.
   * @returns {gmaps.LatLng} coords
   */
  latLng() {
    return new gmaps.LatLng(
      this.props.data.marker.lat,
      this.props.data.marker.lng
    );
  }

  /**
   * Renders the place.
   * @returns {ReactElement} place
   */
  render() {
    this.updatePlace();

    return (
      <Marker map={this.props.map} id={this.props.data.id} item={this.props.item}
              appState={this.props.appState}
              latLng ={this.latLng()} icon={this.props.data.marker.icon}
              _select={this.props._select} >
      </Marker>
    );
  }

  /**
   * Updates the place based on app state and item state.
   */
  updatePlace() {
    // The item state
    const state = this.props.item;
    // NOTE: I manipulate the break statement to reduce the amount
    //       of code; pay attention to where break statements appear.
    switch(this.props.appState) {
      case AppState.SELECT:
        if(state.$selected || state.$infoWindow) {
          this.showLabel();
          break;
        }
      case AppState.FILTER:
      case AppState.NORMAL:
        if(!state.filter.$active) {
          this.hideLabel();
        }
        else if(state.$zoom === 0) {
          this.showLabel();
        }
        else {
          this.hideLabel();
        }
        break;
      case AppState.SEARCH:
        if(state.search.$active && state.filter.$active) {
          this.showLabel();
        }
        else {
          this.hideLabel();
        }
        break;
    }
  }
}

Place.propTypes = {
  // The map object
  map: PropTypes.object.isRequired,

  // Method for selecting the item
  _select: PropTypes.func.isRequired,

  // Item ID
  id: PropTypes.string.isRequired,
  // Current app state
  appState: PropTypes.string.isRequired,
  // Item state
  item: PropTypes.object.isRequired,
  // Item ata
  data: PropTypes.object.isRequired,
};

export default new ItemStateComponent(Place);
