import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import ItemStore from '../../stores/ItemStore';
import gmaps from '../../GMapsAPI';

import Marker from './Marker';
import TextLabel from './TextLabel';
import InfoWindow from './InfoWindow';

import MapIcon from '../../data/mapIcons.json';
import styles from '../../stylesheets/Marker.scss';

const Place = React.createClass({

  componentWillMount() {
    ItemStore.addSelectListener(this.props.id, this._onSelect);
    this.label = this.createLabel();
  },

  componentWillUnmount() {
    if(this.label)
      this.label.setMap(null);
  },

  createLabel() {
    if(this.props.name !== undefined) {
      return new TextLabel(this.latLng(), this.props.name, styles.markerLabel, this.props.map);
    }
    else {
      return null;
    }
  },

  latLng() {
    return new gmaps.LatLng(
      this.props.marker.lat,
      this.props.marker.lng
    );
  },

  render() {
    const loc = this.props.directions != undefined ?
                this.props.directions :
                [this.props.marker.lat, this.props.marker.lng].join(',');
    const directionsUrl = "https://www.google.com/maps/dir//'"+loc+"'/@"+loc+",17z"
    return (
      <Marker map={this.props.map} id={this.props.id}
              latLng ={this.latLng()} icon={this.props.marker.icon}
              $infoWindow={this.props.$infoWindow}
              _openInfoWindow={this.props._openInfoWindow}
              _closeInfoWindow={this.props._closeInfoWindow}>
        <h4>{this.props.name}</h4>
        <p>{this.props.address}</p>
        <p><a href={this.props.website}>{this.props.website}</a></p>
        <p><a target="_blank" href={directionsUrl}>Get directions</a></p>
        <p><a href="#" onClick={this._onMoreInformation}>More information...</a></p>
      </Marker>
    );
  },

  _onSelect() {
    // This runs on a delay so that the map component can react to changes correctly.
    setTimeout( () => {
      this.props.map.setZoom(18);
      this.props.map.setCenter(this.latLng());
    }, 300);
  },

  _onMoreInformation() {
    this.props._focus(this.props.id);
  },

});

module.exports = Place;
