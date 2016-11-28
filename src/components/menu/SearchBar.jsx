import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';

import FluxComponent from '../../hoc/FluxComponent';

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

class SearchBar extends Component {
  static propTypes = {
    inIndexModal: PropTypes.bool.isRequired,
  }

  render() {
    return (
      <div className={classnames(styles.container)}>
        <div className={classnames(styles.searchBar)}>
          <IndexButton selected={this.props.inIndexModal}
                       {...this.flux()} />
          <input className={classnames(styles.searchBox)} type="text"
                 placeholder="Search ..."
                 onChange={this._onChange.bind(this)} />
        </div>
      </div>
    );
  }

  _onChange(event) {
    this.actions().item.search(event.target.value);
  }
}

module.exports = FluxComponent(SearchBar);
