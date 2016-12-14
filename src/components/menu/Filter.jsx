import React, {Component, PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import FluxComponent from '../../hoc/FluxComponent';

import classnames from 'classnames/bind';
import styles from '../../stylesheets/Filter.scss';
const cx = classnames.bind(styles);

class CategoryOption extends Component {
  constructor(props) {
    super(props);

    this.state = {
      $hover: false,
    };
  }

  render() {
    return (
      <li className={cx("filter-entry")} onClick={this._onClick.bind(this)}
          onMouseEnter={this._onMouseEnter.bind(this)}
          onMouseLeave={this._onMouseLeave.bind(this)}
      >
        <div className={cx("checkbox", {"active": this.props.$active, "hover": this.state.$hover})}>
          <i className={cx("material-icons")}>done</i>
        </div>
        <div className={cx("name")}>
          {this.props.category}
        </div>
      </li>
    );
  }

  _onClick() {
    if(!this.props.$active) {
      this.props._addCategory(this.props.category);
    }
    else {
      this.props._remCategory(this.props.category);
    }
  }

  _onMouseEnter() {
    this.setState({$hover: true});
  }

  _onMouseLeave() {
    this.setState({$hover: false});
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
