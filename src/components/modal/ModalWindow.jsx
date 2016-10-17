import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import styles from '../../stylesheets/ModalWindow.scss';

const ModalWindow = React.createClass({
  render() {
    let child = null;
    if(this.props.children !== null) {
      child = (
        <div tabIndex="1" className={styles.modalWindow} onClick={this._unfocus} onKeyDown={this._keyPress}>
          <div className={styles.content} onClick={this._childClick}>
            <div className={styles.x} onClick={this._unfocus}>x</div>
            {this.props.children}
          </div>
        </div>
      );
    }
    return (
      <ReactCSSTransitionGroup
          transitionName={{
            enter: styles.enter,
            enterActive: styles.enterActive,
            leave: styles.leave,
            leaveActive: styles.leaveActive,
          }}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
      >
        {child}
      </ReactCSSTransitionGroup>
    );
  },

  _unfocus() {
    this.props._unfocus();
  },

  _childClick(e) {
    e.stopPropagation();
  },

  _keyPress(e) {
    if(e.keyCode == 27) this.props._unfocus();
  }
});

module.exports = ModalWindow;
