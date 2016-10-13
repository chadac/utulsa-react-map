import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';

import AppState from '../../constants/AppState';

import SearchResults from './SearchResults';

import styles from '../../stylesheets/SearchBar.scss';

const SearchBar = React.createClass({
  getDefaultProps() {
    return {
      _search: PropTypes.func.isRequired,
      filterBy: PropTypes.bool.isRequired,
    };
  },

  render() {
    var filterStyles = {};
    filterStyles[styles.selected] = this.props.filterBy;
    return (
      <div className={classnames(styles.container)}>
        <div className={classnames(styles.searchBar)}>
          <div className={classnames(styles.filterBy, filterStyles)}
               onClick={this._toggleFilter}>
            <div className={classnames(styles.filterIcon, styles.topBar)} />
            <div className={classnames(styles.filterIcon, styles.midBar)} />
            <div className={classnames(styles.filterIcon, styles.lowBar)} />
          </div>
          <input className={classnames(styles.searchBox)} type="text"
                 placeholder="Search ..."
                 onChange={this._onChange} />
        </div>
      </div>
    );
  },

  _onChange(event) {
    this.props._search(event.target.value);
  },

  _toggleFilter() {
    if(this.props.filterBy) {
      this.props._closeFilterBy();
    } else {
      this.props._openFilterBy();
    }
  }
});

module.exports = SearchBar;
