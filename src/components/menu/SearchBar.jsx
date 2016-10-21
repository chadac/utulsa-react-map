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
    if(this.props.selected) {
      this.props._closeFilterBy();
    } else {
      this.props._openFilterBy();
    }
  }
});

const IndexButton = React.createClass({
  render() {
    var style = {};
    style[styles.selected] = this.props.selected;
    return(
      <div className={classnames(styles.index, style)}
           onClick={this.props._openIndex}>
        <div className={classnames(styles.indexIcon)} />
        <div className={classnames(styles.indexIcon)} />
        <div className={classnames(styles.indexIcon)} />
      </div>
    );
  },
});

const CenterButton = React.createClass({
  render() {
    return (
      <div className={classnames(styles.center)}
           onClick={this._onClick}>
        <span>◎</span>
      </div>
    );
  },

  _onClick() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude,
              lng = pos.coords.longitude;
        this.props._zoom(17);
        this.props._center(lat, lng);
      });
    }
  },
});

const SearchBar = React.createClass({
  getDefaultProps() {
    return {
      _search: PropTypes.func.isRequired,
      filterBy: PropTypes.bool.isRequired,
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
          <IndexButton selected={this.props.inIndexModal}
                       _openIndex={this.props._openIndex} />
          <CenterButton _center={this.props._center} _zoom={this.props._zoom} />
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
