import React, {Component, PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import AppState from '../../constants/AppState';
import classnames from 'classnames';
import styles from '../../stylesheets/SearchResults.scss';

/**
 * Custom groupby function.
 **/
function groupBy(items, key) {
  // get categories
  var c = {};
  items.forEach((item) => {
    if(c[item[key]] == undefined)
      c[item[key]] = [item]
    else
      c[item[key]].push(item);
  });
  return c;
}

const SearchCategory = React.createClass({
  render() {
    return (
      <div>
        <div className={classnames(styles.searchItem, styles.header)}>
          <span className={classnames(styles.name)}>{this.props.name}</span>
        </div>
        {this.props.children}
      </div>
    );
  },
});

const SearchItem = React.createClass({
  render() {
    return (
      <div className={classnames(styles.searchItem, styles.item)}
           onClick={this._onClick}>
        <span className={classnames(styles.name)}>{this.props.name}</span>
        {this.props.$searchTerms.length > 0 ? (
           <span className={classnames(styles.terms)}>
             ({this.props.$searchTerms.join(", ")})
           </span>
         ) : null}
      </div>
    );
  },

  _onClick() {
    this.props.select(this.props.id);
  },
});

const SearchResults = React.createClass({
  getDefaultProps() {
    return {
      items: PropTypes.array.isRequired,
    };
  },

  render() {
    const groups = groupBy(this.props.items, "category");
    const searchCats = Object.keys(groups).map((name) => {
      const groupItems = groups[name].map((item) =>
        <SearchItem select={this.props.select} key={item.id} {...item} />
      );
      return (
        <SearchCategory key={name} name={name}>
          {groupItems}
        </SearchCategory>
      );
    });
    return (
      <div key="main" className={classnames(styles.searchResults)}>
          {searchCats}
      </div>
    );
  },
});

module.exports = SearchResults;
