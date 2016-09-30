import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';
import styles from '../../stylesheets/SearchBar.scss';

import SearchResults from './SearchResults';

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
          <input className={classnames(styles.searchBox)} type="text"
                 placeholder="Search ..."
                 onChange={this._onChange} />
        </div>
        {this.props.appState == "SEARCH" ?
         (<SearchResults items={this.props.items} />)
         : null }
      </div>
    );
  },

  _onChange(event) {
    this.props._search(event.target.value);
  },
});

module.exports = SearchBar;
