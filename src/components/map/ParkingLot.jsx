import React, {Component, PropTypes} from 'react';
import gmaps from '../../GMapsAPI';
import AppState from '../../constants/AppState';
import InfoWindow from './InfoWindow';

function polyStyles(data) {
  const defaults = {
    strokeColor: "#AAAAAA",
    strokeOpacity: 0.4,
    strokeWeight: 5,
    fillColor: "#FF0000",
    fillOpacity: 0.5,
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
    const center = this.props.parking_lot.center;
    this.center = new gmaps.LatLng(center.lat, center.lng);
  }

  _createPolygons() {
    const numLayers = this.props.parking_lot.layer.length;
    var polys = []
    for(var i = 0; i < numLayers; i++) {
      var polyData = polyStyles(this.props.parking_lot);
      var layer = this.props.parking_lot.layer[i];
      polyData.paths = layer
        .map((coord) => new gmaps.LatLng(coord.lat, coord.lng));
      var poly = new gmaps.Polygon(polyData);
      poly.setMap(this.props.map);
      poly.addListener('click', this._onClick.bind(this));
      polys.push(poly);
    }
    return polys;
  }

  componentWillUnmount() {
    this.polys.forEach((poly) => poly.setMap(null));
  }

  render() {
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
          $infoWindow={this.props.$infoWindow}
          map={this.props.map}
          position={position}
          _closeInfoWindow={this.props._closeInfoWindow}>
        <h4>{this.props.name}</h4>
        <p>{this.props.hours}</p>
      </InfoWindow>
    );
  }

  _onClick(e) {
    this.setState({clickPos: e.latLng});
    this.props._openInfoWindow(this.props.id);
  }

}

ParkingLot.propTypes = {
  map: PropTypes.object.isRequired,
  appState: PropTypes.string.isRequired,

  _openInfoWindow: PropTypes.func.isRequired,
  _closeInfoWindow: PropTypes.func.isRequired,

  $infoWindow: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
  hours: PropTypes.string,
  parking_lot: PropTypes.object,
};

module.exports = ParkingLot;
