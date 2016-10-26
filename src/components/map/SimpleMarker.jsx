import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import ItemStore from '../../stores/ItemStore';
import gmaps from '../../GMapsAPI';

import Marker from './Marker';
import TextLabel from './TextLabel';
import InfoWindow from './InfoWindow';

import MapIcon from '../../data/mapIcons.json';
import styles from '../../stylesheets/Marker.scss';

const SimpleMarker = React.createClass({
  latLng() {
    return new gmaps.LatLng(
      this.props.marker.lat,
      this.props.marker.lng
    );
  },

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
  },
});

module.exports = SimpleMarker;
