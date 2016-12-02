import React, {Component, PropTypes} from 'react';

import FluxComponent from '../../hoc/FluxComponent';
import ItemHelpers from '../../helpers/ItemHelpers';

import classnames from 'classnames/bind';
import styles from '../../stylesheets/SearchResults.scss';
const cx = classnames.bind(styles);


class SearchCategory extends Component{
  render() {
    // const arrowChar = this.props.selected ? "&#9660;" : "&#9650;";
    return (
      <div>
        <div className={cx("search-item", "header")}
             onClick={this._onCheck.bind(this)}>
          <span className={cx("name", {"active": this.props.selected,
                                       "inactive": !this.props.selected})}>
            {this.props.name}
          </span>
        </div>
        {this.props.selected ? this.props.children : null}
      </div>
    );
  }

  _onCheck() {
    if(!this.props.selected) {
      this.props._addCategory(this.props.name);
    } else {
      this.props._remCategory(this.props.name);
    }
  }
}

SearchCategory.propTypes = {
  selected: PropTypes.bool.isRequired,

  _addCategory: PropTypes.func.isRequired,
  _remCategory: PropTypes.func.isRequired,

  name: PropTypes.string.isRequired,
};


class SearchItem extends Component {
  render() {
    return (
      <div className={cx("search-item", "item")}
           onClick={this._onClick.bind(this)}>
        <span className={cx("name")}>{this.props.name}</span>
        {this.props.$searchTerms.length > 0 ? (
           <span className={cx("terms")}>
             ({this.props.$searchTerms.join(", ")})
           </span>
         ) : null}
      </div>
    );
  }

  _onClick() {
    this.props._select(this.props.id);
  }
}

SearchItem.propTypes = {
  _select: PropTypes.func.isRequired,

  $searchTerms: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};


class SearchResults extends Component {
  render() {
    const groups = ItemHelpers.groupBy(this.props.items, "category");
    const searchCats = this
      .props.categories
      .filter((name) => typeof groups[name] !== "undefined")
      .map((name) => {
      const groupItems = groups[name].map((item) =>
        <SearchItem _select={this.actions().item.select} key={item.id} {...item} />
      );
      return (
        <SearchCategory key={name} name={name}
                        selected={this.props.activeCategories.indexOf(name) >= 0}
                        _addCategory={this.actions().item.addCategory}
                        _remCategory={this.actions().item.remCategory}>
          {groupItems}
        </SearchCategory>
      );
    });
    return (
      <div key="main" className={cx("search-results")}>
          {searchCats}
      </div>
    );
  }
}

SearchResults.propTypes = {
  items: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  activeCategories: PropTypes.array.isRequired,
};


export default FluxComponent(SearchResults);
