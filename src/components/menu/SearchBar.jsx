import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';

import AppState from '../../constants/AppState';

import SearchResults from './SearchResults';

import styles from '../../stylesheets/SearchBar.scss';

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
        this.props._setUserPosition(lat, lng);
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
          <IndexButton selected={this.props.inIndexModal}
                       _openIndex={this.props._openIndex} />
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
