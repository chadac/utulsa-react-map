import React, {Component, PropTypes} from 'react';

import gmaps from '../../GMapsAPI';

class InfoWindow extends Component {
  componentWillMount() {
    this.info = new gmaps.InfoWindow();
    this.info.addListener("closeclick", this._onCloseInfoWindow.bind(this));
  }

  componentWillUnmount() {
    this.info.close();
  }

  render() {
    return (
      <div style={{display: "none"}}>
        <div ref={c => this.infoWindowContent = c}>
          {this.props.children}
        </div>
      </div>
    );
  }

  componentDidUpdate() {
    this.info.setContent(this.infoWindowContent);
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
  }

  _onCloseInfoWindow() {
    this.props._closeInfoWindow();
  }
}

InfoWindow.propTypes = {
  $infoWindow: PropTypes.bool.isRequired,
  map: PropTypes.object.isRequired,
  position: PropTypes.object.isRequired,

  _closeInfoWindow: PropTypes.func,
};

module.exports = InfoWindow;
