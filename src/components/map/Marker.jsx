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
    _openInfoWindow: PropTypes.func.isRequired,
    _closeInfoWindow: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      $infoWindowOpened: false
    };
  },

  componentWillMount() {
    ItemStore.addSelectListener(this.props.id, this._onSelect);

    this.marker = this.createMarker();
    this.marker.addListener("click", this._onClick);
    this.marker.addListener("mouseover", this._onMouseOver);
    this.marker.addListener("mouseout", this._onMouseOut);

    this.label = this.createLabel();
  },

  componentDidMount() {
  },

  componentWillUnmount() {
    this.marker.setMap(null);
    if(this.label)
      this.label.setMap(null);
  },

  latlng() {
    return new gmaps.LatLng(
      this.props.marker.lat,
      this.props.marker.lng
    );
  },

  createMarker() {
    return new gmaps.Marker({
      position: this.latlng(),
      icon: MapIcon[this.props.marker.icon],
      draggable: false,
      map: this.props.map,
    });
  },

  createLabel() {
    if(this.props.name !== undefined) {
      return new TextLabel(this.latlng(), this.props.name, styles.markerLabel, this.props.map);
    }
    else {
      return null;
    }
  },

  render() {
    const loc = this.props.directions != "" ?
                this.props.directions :
                [this.props.marker.lat, this.props.marker.lng].join(',');
    const directionsUrl = "https://www.google.com/maps/dir//'"+loc+"'/@"+loc+",17z"
    const name = this.props.name !== undefined ? this.props.name
               : this.props.label + " " + this.props.id;
    return (
      <InfoWindow $infoWindow={this.props.$infoWindow} map={this.props.map}
                  position={this.marker}
                  _closeInfoWindow={this.props._closeInfoWindow}>
        <h4>{name}</h4>
        <p>{this.props.address}</p>
        <p><a href={this.props.website}>{this.props.website}</a></p>
        <p><a target="_blank" href={directionsUrl}>Get directions</a></p>
      </InfoWindow>
    );
  },

  _onClick() {
    this.props._openInfoWindow(this.props.id);
  },

  _onMouseOver() {
  },

  _onMouseOut() {
  },

  _onSelect() {
    // This runs on a delay so that the map component can react to changes correctly.
    setTimeout( () => {
      this.props.map.setZoom(18);
      this.props.map.setCenter(this.latlng());
    }, 300);
  },

});

export default Marker;
