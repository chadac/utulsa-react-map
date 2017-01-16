import React, {Component, PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import FluxComponent from '../../hoc/FluxComponent';

import {groupBy} from '../../helpers/ItemHelpers';

import classnames from 'classnames/bind';
import styles from '../../stylesheets/Filter.scss';
const cx = classnames.bind(styles);

/**
 * Check box for categories.
 * @class
 */
class CategoryOption extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Tracks if the map is hovering over this item
      $hover: false,
    };
  }

  /**
   * Render step.
   * @returns {ReactElement} categoryOption
   */
  render() {
    return (
      <li className={cx("filter-entry", "category")} onClick={this._onClick.bind(this)}
          onMouseEnter={this._onMouseEnter.bind(this)}
          onMouseLeave={this._onMouseLeave.bind(this)}
      >
        <div className={cx("checkbox", {"active": this.props.$active, "hover": this.state.$hover})}>
          <i className={cx("material-icons")}>done</i>
        </div>
        <div className={cx("name")}>
          {this.props.category.name}
        </div>
      </li>
    );
  }

  /**
   * Triggers when block is clicked. Either marks or unmarks the category
   * as active.
   */
  _onClick() {
    if(!this.props.$active) {
      this.props._addCategory(this.props.category.name);
    }
    else {
      this.props._remCategory(this.props.category.name);
    }
  }

  /**
   * Triggers when mouse enters the element.
   */
  _onMouseEnter() {
    this.setState({$hover: true});
  }

  /**
   * Triggers when mouse leaves the element.
   */
  _onMouseLeave() {
    this.setState({$hover: false});
  }
}

CategoryOption.propTypes = {
  // The information about this category (name, etc)
  category: PropTypes.object.isRequired,
  // If this category is currently active
  $active: PropTypes.bool.isRequired,

  // Marks category as active in Item Store
  _addCategory: PropTypes.func.isRequired,
  // Marks category as inactive in Item Store
  _remCategory: PropTypes.func.isRequired,
};


/**
 * Grouping of categories. This makes the filter menu easier to navigate.
 * @class
 */
class CategoryGroup extends Component {
  constructor(props) {
    super(props);

    // Icons for expanding/minimizing a list of categories
    this.icons = {
      more: (<i className="material-icons">expand_more</i>),
      less: (<i className="material-icons">expand_less</i>),
    };

    this.state = {
      // True when object is hovered.
      $hover: false,
    };
  }

  /**
   * Render step.
   * @returns {ReactElement} categoryGroup
   */
  render() {
    let cats = this.props.cats.map((cat) => (
      <CategoryOption key={cat.category.name} {...cat}
                      _addCategory={this.props._addCategory}
                      _remCategory={this.props._remCategory} />
    ));
    return (
      <div className={cx("group-list-item")}>
        <ul className={cx("filter-entries")}>
          <li className={cx("filter-entry", "group")} onClick={this._onClick.bind(this)}
              onMouseEnter={this._onMouseEnter.bind(this)}
              onMouseLeave={this._onMouseLeave.bind(this)}>
            <div className={cx("checkbox", {"hover": this.state.$hover})}>
              <i className={cx("material-icons")}>
                {this.props.expanded ? this.icons.more : this.icons.less}
              </i>
            </div>
            <div className={cx("name")}>
              {this.props.group}
            </div>
          </li>
          {this.props.expanded ? cats : null}
        </ul>
      </div>
    );
  }

  /**
   * Triggers when grouping item is clicked.
   */
  _onClick() {
    this.props._select(this.props.group);
  }

  /**
   * Triggers when mouse enters group item.
   */
  _onMouseEnter() {
    this.setState({$hover: true});
  }

  /**
   * Triggers when mouse leaves group item.
   */
  _onMouseLeave() {
    this.setState({$hover: false});
  }
}

CategoryGroup.propTypes = {
  // Name of the group
  group: PropTypes.string.isRequired,
  // Array of sub-categories
  cats: PropTypes.array.isRequired,
  // True if the sub-categories should be shown
  expanded: PropTypes.bool.isRequired,

  // Marks the group as select/not selected
  _select: PropTypes.func.isRequired,
  // Marks a category as active in the Item Store
  _addCategory: PropTypes.func.isRequired,
  // Marks a category as inactive in the Item Store
  _remCategory: PropTypes.func.isRequired,
}


/**
 * Main listing of all categories to be filtered.
 * @class
 */
class Filter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // The group to expand
      group: "CAMPUS",
    };
  }

  /**
   * Render step.
   * @returns {ReactElement} filter
   */
  render() {
    if(!this.props.display) return null;
    const catList = Object.keys(this.props.cats).map((key) => this.props.cats[key]);
    // Groups all categories by their group name.
    const groups = groupBy(catList, "group");
    const catGroups = Object
      .keys(groups)
      .map((key) => {
        let cats = groups[key].map((category) => {
          return {
            category: category,
            $active: this.props.activeCats.has(category.name),
          }
        });
        return (
          <CategoryGroup key={key} group={key} cats={cats}
                         expanded={this.state.group === key}
                         _select={this._selectGroup.bind(this)}
                         _addCategory={this.props._addCategory}
                         _remCategory={this.props._remCategory} />
        );
      });
    return (
      <div className={cx("filter")} style={
        {maxHeight: this.props.height,
         display: this.props.display ? "" : "none"}}>
        {catGroups}
      </div>
    );
  }

  /**
   * Selects the group to be expanded. If reselecting the currently expanded
   * group, it minimizes all groups.
   * @param {string} group The new group to be selected.
   */
  _selectGroup(group) {
    if(this.state.group !== group)
      this.setState({group: group});
    else
      this.setState({group: null});
  }
}

Filter.propTypes = {
  // Categories
  cats: PropTypes.object.isRequired,
  // Active categories
  activeCats: PropTypes.object.isRequired,

  // Marks categories as active in the Item Store
  _addCategory: PropTypes.func.isRequired,
  // Marks categories as inactive in the Item Store
  _remCategory: PropTypes.func.isRequired,

  // The height of the filter menu
  height: PropTypes.number.isRequired,
  // Boolean to display the menu
  display: PropTypes.bool.isRequired,
};

export default FluxComponent(Filter);
