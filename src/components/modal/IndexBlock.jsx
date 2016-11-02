import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import classnames from 'classnames';
import styles from '../../stylesheets/IndexBlock.scss';

const ItemLink = React.createClass({
  render() {
    return (
      <div className={classnames(styles.entry, styles.item)}>
        <a href="#" onClick={this._onClick}>{this.props.name}</a>
      </div>
    );
  },

  _onClick() {
    this.props._select(this.props.id);
  },
});

const IndexBlock = React.createClass({
  render() {
    const categories = Object.keys(this.props.items);
    const items = this.props.items;
    const renderedItems = categories
      .filter((category) => items[category] !== undefined || items[category].length > 0)
      .map((category) => {
        var subItems = items[category]
          .filter((item) => item.name !== undefined)
          .map((item) => (
            <ItemLink name={item.name} id={item.id} _select={this.props._select} />
          ));
        if(subItems.length > 0) {
          subItems.unshift(
            (<div className={classnames(styles.entry, styles.header)}>{category}</div>)
          );
          return subItems;
        }
        else return null;
      });
    return (
      <div className={styles.container}>
        <div className={styles.title}>
          <h2>Index</h2>
        </div>
        <div className={styles.indexBlock}>
          {renderedItems}
        </div>
      </div>
    );
  },
});

module.exports = IndexBlock;
