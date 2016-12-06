import React, {Component, PropTypes} from 'react';
import ItemStateHOC from '../../hoc/ItemStateHOC';

import AppState from '../../constants/AppState';
import ItemStore from '../../stores/ItemStore';
import gmaps from '../../GMapsAPI';

import Marker from './Marker';
import TextLabel from './TextLabel';

import classnames from 'classnames/bind';
import styles from '../../stylesheets/Marker.scss';
const cx = classnames.bind(styles);

class Place extends Component {

  componentWillMount() {
    ItemStore.addSelectListener(this.props.data.id, this._onSelect.bind(this));
    this.label = this.createLabel();
  }

  componentWillUnmount() {
    if(this.label)
      this.label.setMap(null);
  }

  createLabel() {
    if(typeof this.props.data.name !== "undefined") {
      let label = new TextLabel(this.latLng(), this.props.data.name, cx('marker-label'), this.props.map);
      /* console.log(label);
       * label.setZIndex(gmaps.Marker.MAX_ZINDEX + 1);*/
      return label;
    }
    else {
      return null;
    }
  }

  latLng() {
    return new gmaps.LatLng(
      this.props.data.marker.lat,
      this.props.data.marker.lng
    );
  }

  render() {
    this.updatePlace();

    const loc = typeof this.props.data.directions !== "undefined" ?
                this.props.data.directions :
                [this.props.data.marker.lat, this.props.data.marker.lng].join(',');
    const directionsUrl = "https://www.google.com/maps/dir//'" + loc + "'/@" + loc + ",17z";
    return (
      <Marker map={this.props.map} id={this.props.data.id} item={this.props.item}
              appState={this.props.appState}
              latLng ={this.latLng()} icon={this.props.data.marker.icon}
              _openInfoWindow={this.props._openInfoWindow}
              _closeInfoWindow={this.props._closeInfoWindow} >
        <h4>{this.props.data.name}</h4>
        <p>{this.props.data.address}</p>
        <p><a href={this.props.data.website}>{this.props.data.website}</a></p>
        <p><a target="_blank" href={directionsUrl}>Get directions</a></p>
      </Marker>
    );
  }

  updatePlace() {
    const state = this.props.item;
    switch(this.props.appState) {
      case AppState.NORMAL:
        if(state.$inZoom) {
          this.label.setMap(this.props.map);
        } else {
          this.label.setMap(null);
        }
        break;
    }
  }

  _onSelect() {
    // This runs on a delay so that the map component can react to changes correctly.
    setTimeout( () => {
      this.props.map.setZoom(18);
      this.props.map.setCenter(this.latLng());
    }, 300);
  }
}

Place.propTypes = {
  map: PropTypes.object.isRequired,

  _openInfoWindow: PropTypes.func.isRequired,
  _closeInfoWindow: PropTypes.func.isRequired,

  appState: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default new ItemStateHOC(Place);
