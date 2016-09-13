import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import MarkerStore from '../stores/MarkerStore';
import Marker from './Marker'
import styles from '../stylesheets/Map.scss'

function getMarkerState() {
  return {
    markers: MarkerStore.getAll()
  }
}

/* class Map extends Component {*/
const Map = React.createClass({
  getDefaultProps() {
    return {
      center: {lat: 36.15159935580428, lng: -95.94644401639404},
      zoom: 16,
      markers: []
    }
  },

  getInitialState() {
    return getMarkerState();
  },

  /* shouldComponentUpdate = shouldPureComponentUpdate;*/

  componentDidMount() {
    MarkerStore.addChangeListener(this._onChange)
    this.map = this.createMap();
  },

  createMap() {
    let mapOptions = {
      zoom: this.props.zoom,
      center: this.props.center
    }

    return new google.maps.Map(this.refs.map, mapOptions);
  },

  render() {
    const markers = Object.keys(this.state.markers).map((id) => (
      <Marker {...this.state.markers[id]} map={this.map} />
    ));
    return (
      <div ref="map" className={styles.Map}>
        {markers}
      </div>
    );
  },

  _onChange() {
    this.setState(getMarkerState());
  },
});

export default Map;
