import React, {Component, PropTypes} from 'react';
import ItemStateHOC from '../../hoc/ItemStateHOC';

import AppState from '../../constants/AppState';

import gmaps from '../../GMapsAPI';
import InfoWindow from './InfoWindow';

class Route extends Component {

  constructor(props) {
    super(props);

    this.state = {
      position: this.props.data.focus.center,
      click: new gmaps.LatLng(0, 0),
    };
  }

  componentWillMount() {
    this.route = this.createRoute();
    this.route.addListener('click', this._onClick.bind(this));
  }

  componentWillUnmount() {
    this.route.setMap(null);
  }

  createPathCoordinates() {
    const route = this.props.data.route;
    return route.path.map((coords) => {
      return new gmaps.LatLng(coords.lat, coords.lng);
    })
  }

  createInfoWindow() {
    const data = this.props.data;
    var content = "<h4>" + data.name + "</h4>"
                + "<p>" + data.address + "</p>"
                + "<p>" + data.website + "</p>";
    return new gmaps.InfoWindow({
      content: content
    });
  }

  createRoute() {
    const route = this.props.data.route;
    return new gmaps.Polyline({
      path: this.createPathCoordinates(),
      geodesic: true,
      strokeColor: route.strokeColor,
      strokeOpacity: route.strokeOpacity,
      strokeWeight: route.strokeWeight,
      map: this.props.map
    });
  }

  render() {
    this.updateRoute();
    let position = null;
    switch(this.props.appState) {
      case AppState.FILTER:
      case AppState.NORMAL:
      case AppState.SEARCH:
        position = this.state.click;
        break;
      case AppState.SELECT:
        position = this.state.position;
        break;
    }
    return (
      <InfoWindow $infoWindow={this.props.item.$infoWindow}
                  map={this.props.map}
                  position={position}
                  _closeInfoWindow={this.props._closeInfoWindow}>
        <h4>{this.props.data.name}</h4>
        <p>{this.props.data.hours}</p>
      </InfoWindow>
    );
  }

  updateRoute() {
    const state = this.props.item;
    // const data = this.props.data;
    switch(this.props.appState) {
      case AppState.FILTER:
        if(state.filter.$active) {
          this.route.setMap(this.props.map);
          break;
        }
      case AppState.NORMAL:
        if(!state.filter.$active) {
          this.route.setMap(null);
        }
        else if(state.$zoom === 0) {
          this.route.setMap(this.props.map);
        }
        else {
          this.route.setMap(null);
        }
        break;
      case AppState.SEARCH:
        if(state.search.$active && state.filter.$active) {
          this.route.setMap(this.props.map);
        }
        else {
          this.route.setMap(null);
        }
        break;
    }
  }

  _onClick(e) {
    this.setState({click: e.latLng});
    this.props._openInfoWindow(this.props.id);
  }
}

Route.propTypes = {
  map: PropTypes.object.isRequired,

  _openInfoWindow: PropTypes.func.isRequired,
  _closeInfoWindow: PropTypes.func.isRequired,

  id: PropTypes.string.isRequired,
  appState: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default new ItemStateHOC(Route);
