import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import classnames from 'classnames';
import styles from '../../stylesheets/IndexBlock.scss';

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
            <div className={classnames(styles.entry, styles.item)}>{item.name}</div>
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
