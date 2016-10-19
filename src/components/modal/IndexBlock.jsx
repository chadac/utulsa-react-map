import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import classnames from 'classnames';
import styles from '../../stylesheets/IndexBlock.scss';

const IndexBlock = React.createClass({
  render() {
    const categories = Object.keys(this.props.items);
    const items = this.props.items;
    const renderedItems = categories.map((category) => {
      var subItems = items[category].map((item) => (
        <div className={classnames(styles.entry, styles.item)}>{item.name}</div>
      ));
      subItems.unshift(
        (<div className={classnames(styles.entry, styles.header)}>{category}</div>)
      );
      return subItems;
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
