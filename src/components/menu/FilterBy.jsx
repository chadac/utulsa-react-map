import React, {Component, PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import AppState from '../../constants/AppState';
import classnames from 'classnames';
import styles from '../../stylesheets/FilterBy.scss';

const FilterBy = React.createClass({
  render() {
    return (
      <ReactCSSTransitionGroup
          transitionName={{
            enter: styles.filterByEnter,
            enterActive: styles.filterByEnterActive,
            leave: styles.filterByLeave,
            leaveActive: styles.filterByLeaveActive
          }}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}>
      </ReactCSSTransitionGroup>
    );
  },
});
