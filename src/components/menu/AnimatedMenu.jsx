import React, {Component, PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classnames from 'classnames';

import styles from '../../stylesheets/AnimatedMenu.scss';

const AnimatedMenu = React.createClass({
  getInitialState() {
    return {
      rendered: false
    };
  },

  componentDidMount() {
    this.setState({rendered: true});
  },

  render() {
    return (
      <ReactCSSTransitionGroup
          transitionName={{
            enter: styles.enter,
            enterActive: styles.enterActive,
            leave: styles.leave,
            leaveActive: styles.leaveActive
          }}
          transitionEnterTimeout={600}
          transitionLeaveTimeout={600}>
        {this.state.rendered ? this.props.children : null}
      </ReactCSSTransitionGroup>
    );
  },
});

module.exports = AnimatedMenu;
