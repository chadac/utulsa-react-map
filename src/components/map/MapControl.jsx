import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

import classnames from 'classnames';

import styles from '../../stylesheets/MapControl.scss';

const MapControl = React.createClass({
  propTypes: {
    id: PropTypes.string.isRequired,
    position: PropTypes.number.isRequired,
    controlUIStyle: PropTypes.object,
    controlTextStyle: PropTypes.object,

    _onClick: PropTypes.func,
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
        textAlign: 'left'
      },
      controlTextStyle: {
        color: 'rgb(25,25,25)',
        fontFamily: 'Roboto,Arial,sans-serif',
        fontSize: '10px',
        lineHeight: '38px',
        paddingLeft: '5px',
        paddingRight: '5px'
      },
    };
  },

  index() {
    const controls = this.props.map.controls[this.props.position].b;
    for(var i = 0; i < controls.length; i++) {
      if(controls[i] !== undefined && controls[i].id == this.props.id) return i;
    }
    return -1;
  },

  updateMapControl() {
    let div = ReactDOM.findDOMNode(this.refs.controlBox);
    this.props.map.controls[this.props.position].b[this.index()] = div;
  },

  componentDidMount() {
    let div = document.createElement("div");
    div.id = this.props.id;
    this.props.map.controls[this.props.position].push(div);
    this.updateMapControl();
  },

  componentWillUnmount() {
    this.props.map.controls.unshift(this.index());
  },

  componentDidUpdate() {
    this.updateMapControl();
  },

  render() {
    return (
      <div style={{display:"none"}}>
        <div ref="controlBox" id={this.props.id}
             className={classnames("gmnoprint",styles.controlContainer)}
             title={this.props.title}>
          <div className={classnames("gm-style-mtc",styles.controlMtc)}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  },

});

module.exports = MapControl;
