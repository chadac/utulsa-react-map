import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import styles from '../../stylesheets/IndexBlock.scss';

const IndexBlock = React.createClass({
  render() {
    const categories = Object.keys(this.props.items);
    const items = this.props.items;
    const renderedItems = categories.map((category) => {
      const subItems = items[category].map((item) => (
        <div className={styles.item}>{item.name}</div>
      );
      return (
        <div className={styles.category}>
          <span className={styles.categoryHeader}>{category}</span>
          {subItems}
        </div>
      );
    });
    return (
      <div className={styles.IndexBlock}>
        {renderedItems}
      </div>
    );
  },
});

module.exports = IndexBlock;
