import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Marker from './Marker'
import styles from '../stylesheets/Map.scss'

class Map extends Component {
  static defaultProps = {
    center: {lat: 36.15159935580428, lng: -95.94644401639404},
    zoom: 16,
    markers: []
  };

  state = {
    activePlace: null
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  componentDidMount() {
    this.map = this.createMap();
  }

  createMap() {
    let mapOptions = {
      zoom: this.props.zoom,
      center: this.props.center
    }

    return new google.maps.Map(this.refs.map, mapOptions);
  }

  render() {
    /* const places = this.props.markers
     *                    .map((marker) => (
     *                      <Marker
     *                          key={marker.name}
     *                          lat={marker.geo.latitude}
     *                          lng={marker.geo.longitude}
     *                          place={marker}
     *                          active={this.state.activePlace == marker.name}
     *                      />
     *                    ));*/
    return (
      <div ref="map" className={styles.Map}>
      </div>
    );
  }
}

export default Map;
