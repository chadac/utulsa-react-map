import React, {Component, PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import AppState from '../../constants/AppState';
import classnames from 'classnames';
import styles from '../../stylesheets/FilterBy.scss';

const FilterBy = React.createClass({
  render() {
    const checkboxes = this.props.categories.map((category) => (
      <div key={category} className={styles.checkbox}>
        <span>{category}</span>
        <input type="checkbox" value={category} />
      </div>
    ));
    return (
      <div className={styles.FilterBy}>
        {checkboxes}
      </div>
    );
  },
});

module.exports = FilterBy;
