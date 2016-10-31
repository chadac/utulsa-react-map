import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import ItemStore from '../../stores/ItemStore';
import gmaps from '../../GMapsAPI';

import TextLabel from './TextLabel';
import InfoWindow from './InfoWindow';

import MapIcon from '../../data/mapIcons.json';
import styles from '../../stylesheets/Marker.scss';

const Marker = React.createClass({
  propTypes: {
    map: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    icon: PropTypes.string,
    latLng: PropTypes.object.isRequired,
    $infoWindow: PropTypes.bool,
    _openInfoWindow: PropTypes.func,
    _closeInfoWindow: PropTypes.func,
  },

  componentWillMount() {
    this.marker = this.createMarker();
    this.marker.addListener("click", this._onClick);
  },

  componentWillUnmount() {
    this.marker.setMap(null);
  },

  createMarker() {
    return new gmaps.Marker({
      position: this.props.latLng,
      icon: MapIcon[this.props.icon],
      draggable: false,
      map: this.props.map,
    });
  },

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
  },

  componentDidUpdate() {
    this.marker.setPosition(this.props.latLng);
  },

  _onClick() {
    if(this.props._openInfoWindow)
      this.props._openInfoWindow(this.props.id);
  },
});

export default Marker;
