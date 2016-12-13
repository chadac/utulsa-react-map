import React, {Component, PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import FluxComponent from '../../hoc/FluxComponent';

import classnames from 'classnames/bind';
import styles from '../../stylesheets/Filter.scss';
const cx = classnames.bind(styles);

class CategoryOption extends Component {
  render() {
    return (
      <li>
        <input ref="checkbox" type="checkbox" checked={this.props.$active}
               onChange={this._onChange.bind(this)} />
        {this.props.category}
      </li>
    );
  }

  _onChange() {
    if(!this.props.$active) {
      this.props._addCategory(this.props.category);
    }
    else {
      this.props._remCategory(this.props.category);
    }
  }
}

CategoryOption.propTypes = {
  category: PropTypes.string.isRequired,
  $active: PropTypes.bool.isRequired,
  _addCategory: PropTypes.func.isRequired,
  _remCategory: PropTypes.func.isRequired,
};

class Filter extends Component {
  render() {
    if(!this.props.display) return null;
    const cats = this
      .props.cats.map((cat) => {
        return (
          <CategoryOption key={cat}
              category={cat} $active={this.props.activeCats.indexOf(cat) >= 0}
              _addCategory={this.props._addCategory}
              _remCategory={this.props._remCategory} />
        );
      });
    return (
      <div className={cx("filter")}>
        <ul>
          {cats}
        </ul>
      </div>
    );
  }
}

Filter.propTypes = {
  cats: PropTypes.array.isRequired,
  activeCats: PropTypes.array.isRequired,

  _addCategory: PropTypes.func.isRequired,
  _remCategory: PropTypes.func.isRequired,

  height: PropTypes.number.isRequired,
  display: PropTypes.bool.isRequired,
};

export default FluxComponent(Filter);
