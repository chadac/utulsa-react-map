import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import styles from '../../stylesheets/ModalWindow.scss';

const ModalWindow = React.createClass({
  render() {
    let child = null;
    if(this.props.children !== undefined && this.props.children.length == 1) {
      child = (
        <div className={styles.background} onClick={this._unfocus}>
          {this.props.children}
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
});

module.exports = ModalWindow;
