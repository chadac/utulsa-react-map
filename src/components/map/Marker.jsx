import React, {Component, PropTypes} from 'react';

import gmaps from '../../GMapsAPI';
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
    const icon = {
      url: MapIcon[this.props.icon],
      scaledSize: new gmaps.Size(32, 32),
    };
    return new gmaps.Marker({
      position: this.props.latLng,
      icon: icon,
      draggable: false,
      map: this.props.map,
    });
  }

  render() {
    if(this.props.children) {
      return (
        <InfoWindow
            $infoWindow={this.props.$infoWindow} map={this.props.map}
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

  _onClick() {
    if(this.props._openInfoWindow)
      this.props._openInfoWindow(this.props.id);
  }
}

Marker.propTypes = {
  map: PropTypes.object.isRequired,

  _openInfoWindow: PropTypes.func.isRequired,
  _closeInfoWindow: PropTypes.func.isRequired,

  $infoWindow: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  icon: PropTypes.string,
  latLng: PropTypes.object.isRequired,
};

export default Marker;
