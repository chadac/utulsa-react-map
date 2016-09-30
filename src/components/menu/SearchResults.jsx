import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';
import styles from '../../stylesheets/SearchResults.scss';

const SearchItem = React.createClass({
  render() {
    return (
      <a href="#" className={classnames(styles.searchItem)}
         onClick={this._onClick}>
        <span>{this.props.name}</span>
      </a>
    );
  },
});

const SearchResults = React.createClass({
  getDefaultProps() {
    return {
      items: PropTypes.array.isRequired,
    };
  },

  render() {
    const searchItems = this
      .props.items.map((item) => (
        <SearchItem key={item.id} {...item} />
      ));
    return (
      <div className={classnames(styles.searchResults)}>
        {searchItems}
      </div>
    );
  },
});

module.exports = SearchResults;
