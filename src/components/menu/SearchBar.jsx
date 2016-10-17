import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';

import AppState from '../../constants/AppState';

import SearchResults from './SearchResults';

import styles from '../../stylesheets/SearchBar.scss';

const FilterByButton = React.createClass({
  render() {
    var filterStyles = {};
    filterStyles[styles.selected] = this.props.selected;
    return (
      <div className={classnames(styles.filterBy, filterStyles)}
           onClick={this._toggleFilter}>
        <div className={classnames(styles.filterIcon, styles.topBar)} />
        <div className={classnames(styles.filterIcon, styles.midBar)} />
        <div className={classnames(styles.filterIcon, styles.lowBar)} />
      </div>
    );
  },

  _toggleFilter() {
    console.log('eh');
    if(this.props.appState == AppState.FILTER) {
      this.props._closeFilterBy();
      this.props._resetCategories();
    } else {
      this.props._openFilterBy();
    }
  }
});

const IndexButton = React.createClass({
  render() {
    var style = {};
    style[styles.selected] = this.props.indexActive;
    return(
      <div className={classnames(styles.index, style)}>
        <div className={classnames(styles.indexIcon)} />
        <div className={classnames(styles.indexIcon)} />
        <div className={classnames(styles.indexIcon)} />
      </div>
    );
  },
});

const SearchBar = React.createClass({
  getDefaultProps() {
    return {
      _search: PropTypes.func.isRequired,
    };
  },

  render() {
    return (
      <div className={classnames(styles.container)}>
        <div className={classnames(styles.searchBar)}>
          <FilterByButton selected={this.props.filterBy}
                          _closeFilterBy={this.props._closeFilterBy}
                          _resetCategories={this.props._resetCategories}
                          _openFilterBy={this.props._openFilterBy} />
          <IndexButton selected={false} />
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
});

module.exports = SearchBar;
