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
    return new gmaps.Marker({
      position: this.props.latLng,
      icon: icon,
      draggable: false,
      map: this.props.map,
    });
  }

  resizeMarker(size) {
    this.marker.setIcon({
      url: MapIcon[this.props.icon],
      scaledSize: new gmaps.Size(size,size)
    });
  }

  render() {
    this.updateMarker();

    if(this.props.children) {
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

  updateMarker() {
    const state = this.props.item;
    const appState = this.props.appState;
    switch(appState) {
      case AppState.NORMAL:
        if(state.$inZoom) {
          this.resizeMarker(32, 32);
        }
        else {
          this.resizeMarker(8, 8);
        }
        break;
      case AppState.SEARCH:
        if(state.search.$active) {
          this.resizeMarker(32, 32);
        }
        else {
          this.resizeMarker(8, 8);
        }
        break;
      case AppState.FILTER:
        if(state.filter.$active) {
          this.marker.setMap(this.props.map);
        } else {
          this.marker.setMap(null);
        }
        break;
    }
  }

  _onClick() {
    if(this.props._openInfoWindow)
      this.props._openInfoWindow(this.props.id);
  }
}

Marker.propTypes = {
  map: PropTypes.object.isRequired,

  _openInfoWindow: PropTypes.func,
  _closeInfoWindow: PropTypes.func,

  appState: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  icon: PropTypes.string.isRequired,
};

export default Marker;
