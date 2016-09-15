import React, {Component} from 'react'
import shouldPureComponentUpdate from 'react-pure-render/function'
import ItemStore from '../stores/ItemStore'
import Marker from './Marker'
import Route from './Route'
import styles from '../stylesheets/Map.scss'

function getItemState() {
  return {
    markers: ItemStore.getMarkers(),
    routes: ItemStore.getRoutes()
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
    return getItemState();
  },

  /* shouldComponentUpdate = shouldPureComponentUpdate;*/

  componentDidMount() {
    ItemStore.addChangeListener(this._onChange)
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
    const markers = this.state.markers
                        .filter((marker) => marker.$active)
                        .map((marker) => (
                          <Marker key={marker.id} {...marker} map={this.map} />
                        ));
    const routes = this.state.routes
                       .filter((route) => route.$active)
                       .map((route) => (
                         <Route key={route.id} {...route} map={this.map} />
                       ));
    return (
      <div ref="map" className={styles.Map}>
        {markers}
        {routes}
      </div>
    );
  },

  _onChange() {
    this.setState(getItemState());
  },
});

export default Map;
