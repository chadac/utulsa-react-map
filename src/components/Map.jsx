import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom';
import shouldPureComponentUpdate from 'react-pure-render/function'
import ItemStore from '../stores/ItemStore'
import ItemActions from '../actions/ItemActions'
import Marker from './Marker'
import Route from './Route'
import styles from '../stylesheets/Map.scss'
import gmaps from '../GMapsAPI';

const Control = React.createClass({
  propTypes: {
    id: PropTypes.string.isRequired,
    position: PropTypes.number.isRequired,
    _onClick: PropTypes.func,
    controlUIStyle: PropTypes.object,
    controlTextStyle: PropTypes.object,
  },

  getDefaultProps() {
    // TODO: Move these div styles over to the SASS file
    return {
      controlUIStyle: {
        backgroundColor: '#fff',
        border: '2px solid #fff',
        borderRadius: '3px',
        boxShadow: '0 2px 6px rgba(0,0,0,.3)',
        cursor: 'pointer',
        marginBottom: '22px',
        textAlign: 'center'
      },
      controlTextStyle: {
        color: 'rgb(25,25,25)',
        fontFamily: 'Roboto,Arial,sans-serif',
        fontSize: '16px',
        lineHeight: '38px',
        paddingLeft: '5px',
        paddingRight: '5px'
      },
    };
  },

  componentDidMount() {
  },

  render() {
    return (
      <div ref={this.props.id} style={this.props.controlUIStyle}
           title ={this.props.title}>
        <div style={this.props.controlTextStyle}>
          {this.props.text}
        </div>
      </div>
    );
  },
});

var _control_id = 1;
/**
 * Adds a map control. This is the simplest and most React-y way to implement
 * the controls, since React does not like when I move the React component into
 * the DOM.
 **/
function addControl(map, component) {
  let div = document.createElement('div');
  div.ref = "mapControl_" + (++_control_id);
  map.controls[component.props.position].push(div);
  ReactDOM.render(component, div);
}

const Map = React.createClass({
  propTypes: {
    center: PropTypes.object.isRequired,
    zoom: PropTypes.number.isRequired,
    markers: PropTypes.array.isRequired,
    routes: PropTypes.array.isRequired,
    _onZoom: PropTypes.func.isRequired,
    _onCenter: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      rendered: false,
    };
  },

  componentDidMount() {
    this.map = this.createMap();
    this.map.addListener("center_changed", this._onMapCenter);
    this.map.addListener("zoom_changed", this._onMapZoom);
    this.setState({rendered: true});
  },

  createMap() {
    let mapOptions = {
      zoom: this.props.zoom,
      center: this.props.center
    }
    return new gmaps.Map(this.refs.map, mapOptions);
  },

  render() {
    if(this.state.rendered) {
      const map = this.map;
      const markers = this
        .props.markers
        .filter((marker) => marker.$inZoom)
        .map((marker) => (
          <Marker key={marker.id} {...marker} map={map} />
        ));
      const routes = this
        .props.routes
        .filter((route) => route.$inZoom)
        .map((route) => (
          <Route key={route.id} {...route} map={map} />
        ));
      return (
        <div ref="map" className={styles.Map}>
          {markers}
          {routes}
        </div>
      );
    } else {
      return (
        <div ref="map" className={styles.Map}></div>
      );
    }
  },

  _onChange() {
    this.setState(getItemState());
  },

  _onMapCenter() {
    const center = this.map.getCenter();
    this.props._onCenter(center.lat, center.lng);
  },

  _onMapZoom() {
    const zoom = this.map.getZoom();
    this.props._onZoom(zoom);
  }

});

export default Map;
