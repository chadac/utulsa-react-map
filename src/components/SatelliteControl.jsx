/**
 * Control used to switch between satellite/map view.
 */

import React, {Component, PropTypes} from 'react'


class SatelliteControl extends Component {
  constructor(props) {
    super(props);

    this.props.store.addMapListener(this._onMapCreate.bind(this));
    this.state = {
      map: null,
      $satellite: false,
    };
  }

  render() {
    let msg = null;
    if(this.state.$satellite) msg = "on";
    else msg = "off";
    return (
      <div style={{width: 100}}>
        <a onClick={this._onClick.bind(this)}>Satellite: {msg}</a>
      </div>
    );
  }

  _onMapCreate() {
    this.setState({map: this.props.store.getMap()});
  }

  _onClick() {
    if(this.state.map) {
      let $satellite = !this.state.$satellite;
      this.state.map.setMapTypeId($satellite ? "satellite" : "roadmap");
      this.setState({$satellite: $satellite});
    }
  }
}

SatelliteControl.propTypes = {
  store: PropTypes.object.isRequired,
};

export default SatelliteControl;
