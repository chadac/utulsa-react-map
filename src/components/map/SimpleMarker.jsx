import React, {Component, PropTypes} from 'react';

import gmaps from '../../GMapsAPI';
import Marker from './Marker';

class SimpleMarker extends Component {
  latLng() {
    return new gmaps.LatLng(
      this.props.marker.lat,
      this.props.marker.lng
    );
  }

  render() {
    return (
      <Marker map={this.props.map} id={this.props.id}
              latLng ={this.latLng()} icon={this.props.marker.icon}
              $infoWindow={this.props.$infoWindow}
              _openInfoWindow={this.props._openInfoWindow}
              _closeInfoWindow={this.props._closeInfoWindow}>
        <h4>{this.props.label}</h4>
      </Marker>
    );
  }
}

SimpleMarker.propTypes = {
  map: PropTypes.object.isRequired,

  _openInfoWindow: PropTypes.func.isRequired,
  _closeInfoWindow: PropTypes.func.isRequired,

  $infoWindow: PropTypes.bool.isRequired,
  id: PropTypes.string,
  label: PropTypes.string,
  marker: PropTypes.object,
}

module.exports = SimpleMarker;
