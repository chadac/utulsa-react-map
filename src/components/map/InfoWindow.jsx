import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

import gmaps from '../../GMapsAPI';

const InfoWindow = React.createClass({
  propTypes: {
    $infoWindow: PropTypes.bool.isRequired,
    map: PropTypes.object.isRequired,
    position: PropTypes.object.isRequired,

    _closeInfoWindow: PropTypes.func.isRequired,
    _focus: PropTypes.func,
  },

  componentWillMount() {
    this.info = new gmaps.InfoWindow();
    this.info.addListener("closeclick", this._onCloseInfoWindow);
  },

  componentWillUnmount() {
    this.info.close();
  },

  render() {
    return (
      <div style={{display:"none"}}>
        <div ref="infoWindowContent">
          {this.props.children}
        </div>
      </div>
    );
  },

  componentDidUpdate() {
    this.info.setContent(ReactDOM.findDOMNode(this.refs.infoWindowContent));
    if(this.props.$infoWindow) {
      if(this.props.position instanceof gmaps.LatLng) {
        this.info.setOptions({position: this.props.position});
        this.info.open(this.props.map);
      } else {
        this.info.open(this.props.map, this.props.position);
      }
    } else {
      this.info.close();
    }
  },

  _onCloseInfoWindow() {
    this.props._closeInfoWindow();
  },
});

module.exports = InfoWindow;
