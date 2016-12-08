import React, {Component, PropTypes} from 'react';
import ItemStateHOC from '../../hoc/ItemStateHOC';

import gmaps from '../../GMapsAPI';
import Marker from './Marker';

class SimpleMarker extends Component {
  latLng() {
    return new gmaps.LatLng(
      this.props.data.marker.lat,
      this.props.data.marker.lng
    );
  }

  render() {
    return (
      <Marker map={this.props.map} id={this.props.id} item={this.props.item}
              appState={this.props.appState}
              latLng ={this.latLng()} icon={this.props.data.marker.icon}
              _openInfoWindow={this.props._openInfoWindow}
              _closeInfoWindow={this.props._closeInfoWindow}>
        <h4>{this.props.data.label}</h4>
      </Marker>
    );
  }
}

SimpleMarker.propTypes = {
  map: PropTypes.object.isRequired,

  _openInfoWindow: PropTypes.func.isRequired,
  _closeInfoWindow: PropTypes.func.isRequired,

  id: PropTypes.string.isRequired,
  appState: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
}

export default new ItemStateHOC(SimpleMarker);
