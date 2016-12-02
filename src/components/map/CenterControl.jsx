import React, {Component, PropTypes} from 'react';

import MapControl from './MapControl';
import gmaps from '../../GMapsAPI';
import controlStyles from '../../stylesheets/MapControl.scss';

class CenterControl extends Component {

  constructor(props) {
    super(props);

    this.state = {
      hover: false,
    }
  }

  render() {
    const titleStyles = {
      backgroundColor: !this.state.hover ? "rgb(255, 255, 255)" : "rgb(235,235,235)",
      fontSize: "30px",
      padding: "0px 7px",
    };

    return (
      <MapControl id="center" title="Center" map={this.props.map}
                  position={gmaps.ControlPosition.TOP_LEFT}>
        <div onMouseEnter={this._onMouseEnter.bind(this)}
             onMouseLeave={this._onMouseLeave.bind(this)}>
          <div className={controlStyles.controlTitle} style={titleStyles}
               onClick={this._onClick.bind(this)}>
            &#8982;
          </div>
        </div>
      </MapControl>
    );
  }

  _onMouseEnter() {
    this.setState({hover: true});
  }

  _onMouseLeave() {
    this.setState({hover: false});
  }

  _onClick() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude,
              lng = pos.coords.longitude;
        this.props._setUserPosition(lat, lng);
      });
    }
  }
}

CenterControl.propTypes = {
  map: PropTypes.object.isRequired,

  _setUserPosition: PropTypes.func.isRequired,
};

module.exports = CenterControl;
