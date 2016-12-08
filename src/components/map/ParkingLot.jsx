import React, {Component, PropTypes} from 'react';
import ItemStateHOC from '../../hoc/ItemStateHOC';

import gmaps from '../../GMapsAPI';
import AppState from '../../constants/AppState';
import InfoWindow from './InfoWindow';

function polyStyles(data) {
  const defaults = {
    strokeColor: "#AAAAAA",
    strokeOpacity: 0.4,
    strokeWeight: 5,
    fillColor: "#FF0000",
    fillOpacity: 0.8,
  };
  let style = {};
  for(let key of Object.keys(defaults)) {
    style[key] = (typeof data[key] === "undefined") ? defaults[key] : data[key];
  }
  return style;
}

class ParkingLot extends Component {

  constructor(props) {
    super(props);

    this.state = {
      clickPos: new gmaps.LatLng(0, 0),
    };
  }

  componentWillMount() {
    this.polys = this._createPolygons();
    const center = this.props.data.parking_lot.center;
    this.center = new gmaps.LatLng(center.lat, center.lng);
  }

  _createPolygons() {
    const lot = this.props.data.parking_lot;
    const numLayers = lot.layer.length;
    var polys = [];
    for(var i = 0; i < numLayers; i++) {
      var polyData = polyStyles(lot);
      var layer = lot.layer[i];
      polyData.paths = layer
        .map((coord) => new gmaps.LatLng(coord.lat, coord.lng));
      var poly = new gmaps.Polygon(polyData);
      poly.setMap(this.props.map);
      poly.addListener('click', this._onClick.bind(this));
      polys.push(poly);
    }
    return polys;
  }

  showPolygons() {
    this.polys.forEach((poly) => poly.setMap(this.props.map));
  }

  hidePolygons() {
    this.polys.forEach((poly) => poly.setMap(null));
  }

  componentWillUnmount() {
    this.polys.forEach((poly) => poly.setMap(null));
  }

  render() {
    this.updatePoly();
    let position = null;
    switch(this.props.appState) {
      case AppState.NORMAL:
      case AppState.SEARCH:
      case AppState.FILTER:
        position = this.state.clickPos;
        break;
      case AppState.SELECT:
        position = this.center;
        break;
    }

    return (
      <InfoWindow
          $infoWindow={this.props.item.$infoWindow}
          map={this.props.map}
          position={position}
          _closeInfoWindow={this.props._closeInfoWindow}>
        <h4>{this.props.data.name}</h4>
        <p>{this.props.data.hours}</p>
      </InfoWindow>
    );
  }

  updatePoly() {
    const state = this.props.item;

    switch(this.props.appState) {
      case AppState.NORMAL:
        if(state.$zoom === 0) {
          this.showPolygons();
        }
        else {
          this.hidePolygons();
        }
        break;
    }
  }

  _onClick(e) {
    this.setState({clickPos: e.latLng});
    this.props._openInfoWindow(this.props.id);
  }

}

ParkingLot.propTypes = {
  map: PropTypes.object.isRequired,

  _openInfoWindow: PropTypes.func.isRequired,
  _closeInfoWindow: PropTypes.func.isRequired,

  id: PropTypes.string.isRequired,
  appState: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default new ItemStateHOC(ParkingLot);
