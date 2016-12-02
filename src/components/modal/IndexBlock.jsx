import React, {Component, PropTypes} from 'react';

import classnames from 'classnames/bind';
import styles from '../../stylesheets/IndexBlock.scss';
const cx = classnames.bind(styles);

class ItemLink extends Component {
  render() {
    return (
      <div className={classnames(styles.entry, styles.item)}>
        <a href="#" onClick={this._onClick.bind(this)}>{this.props.name}</a>
      </div>
    );
  }

  _onClick() {
    this.props._select(this.props.id);
  }
}

ItemLink.propTypes = {
  _select: PropTypes.func.isRequired,

  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

class IndexBlock extends Component {
  render() {
    const categories = Object.keys(this.props.items);
    const items = this.props.items;
    const renderedItems = categories
      .filter((category) => typeof items[category] !== "undefined" || items[category].length > 0)
      .map((category) => {
        var subItems = items[category]
          .filter((item) => typeof item.name !== "undefined")
          .map((item) => (
            <ItemLink name={item.name} id={item.id} _select={this.props._select} />
          ));
        if(subItems.length > 0) {
          subItems.unshift(
            (<div className={cx("entry", "header")}>{category}</div>)
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
  }
}

IndexBlock.propTypes = {
  items: PropTypes.object.isRequired,

  _select: PropTypes.func.isRequired,
};

module.exports = IndexBlock;
