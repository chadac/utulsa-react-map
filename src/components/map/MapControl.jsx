import React, {Component, PropTypes} from 'react';

import classnames from 'classnames/bind';
import styles from '../../stylesheets/MapControl.scss';
const cx = classnames.bind(styles);

class MapControl extends Component {
  constructor(props) {
    super(props);
  }

  index() {
    const controls = this.props.map.controls[this.props.position].b;
    for(var i = 0; i < controls.length; i++) {
      if(typeof controls[i] !== "undefined" && controls[i].id === this.props.id) return i;
    }
    return -1;
  }

  updateMapControl() {
    let div = this.controlBox;
    this.props.map.controls[this.props.position].b[this.index()] = div;
  }

  componentDidMount() {
    let div = document.createElement("div");
    div.id = this.props.id;
    this.props.map.controls[this.props.position].push(div);
    this.updateMapControl();
  }

  componentWillUnmount() {
    this.props.map.controls.unshift(this.index());
  }

  componentDidUpdate() {
    this.updateMapControl();
  }

  render() {
    return (
      <div style={{display: "none"}}>
        <div ref={ c => this.controlBox = c } id={this.props.id}
             className={cx("gmnoprint", "control-container")}
             title={this.props.title}>
          <div className={cx("gm-style-mtc", "control-mtc")}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

MapControl.propTypes = {
  id: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  map: PropTypes.object.isRequired,
  title: PropTypes.string,

  _onClick: PropTypes.func,
};

export default MapControl;
