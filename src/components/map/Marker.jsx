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

  showMarker() {
    if(this.marker.getMap() !== this.props.map)
      this.marker.setMap(this.props.map);
  }

  hideMarker() {
    if(this.marker.getMap() !== null)
      this.marker.setMap(null);
  }

  resizeMarker(size) {
    this.marker.setIcon({
      url: MapIcon[this.props.icon],
      scaledSize: new gmaps.Size(size, size)
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
      case AppState.SELECT:
        if(state.$selected) {
          this.showMarker();
          this.resizeMarker(38, 38);
          this.marker.setZIndex(3);
          break;
        }
      case AppState.FILTER:
        if(!state.filter.$active) {
          this.hideMarker();
          break;
        }
      case AppState.NORMAL:
        if(state.$zoom === 0) {
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
        if(state.search.$active) {
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

  _onClick() {
    if(this.props._openInfoWindow)
      this.props._select(this.props.id);
  }
}

Marker.propTypes = {
  map: PropTypes.object.isRequired,

  _select: PropTypes.func.isRequired,
  _openInfoWindow: PropTypes.func,
  _closeInfoWindow: PropTypes.func,

  id: PropTypes.string.isRequired,
  latLng: PropTypes.object.isRequired,
  appState: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  icon: PropTypes.string.isRequired,
};

export default Marker;
