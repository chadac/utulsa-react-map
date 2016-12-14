import React, {Component, PropTypes} from 'react'; // eslint-disable-line no-unused-vars
import FluxComponent from '../../hoc/FluxComponent';

import {groupBy} from '../../helpers/ItemHelpers';

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

  _onClick() {
    if(!this.props.$active) {
      this.props._addCategory(this.props.category.name);
    }
    else {
      this.props._remCategory(this.props.category.name);
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
  category: PropTypes.object.isRequired,
  $active: PropTypes.bool.isRequired,
  _addCategory: PropTypes.func.isRequired,
  _remCategory: PropTypes.func.isRequired,
};


class CategoryGroup extends Component {
  constructor(props) {
    super(props);

    this.icons = {
      more: (<i className="material-icons">expand_more</i>),
      less: (<i className="material-icons">expand_less</i>),
    };

    this.state = {
      $hover: false,
    };
  }

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

  _onClick() {
    this.props._select(this.props.group);
  }

  _onMouseEnter() {
    this.setState({$hover: true});
  }

  _onMouseLeave() {
    this.setState({$hover: false});
  }
}

CategoryGroup.propTypes = {
  group: PropTypes.string.isRequired,
  cats: PropTypes.array.isRequired,
  expanded: PropTypes.bool.isRequired,

  _select: PropTypes.func.isRequired,
  _addCategory: PropTypes.func.isRequired,
  _remCategory: PropTypes.func.isRequired,
}


class Filter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      group: "CAMPUS",
    };
  }

  render() {
    if(!this.props.display) return null;
    const catList = Object.keys(this.props.cats).map((key) => this.props.cats[key]);
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

  _selectGroup(group) {
    if(this.state.group !== group)
      this.setState({group: group});
    else
      this.setState({group: null});
  }
}

Filter.propTypes = {
  cats: PropTypes.object.isRequired,
  activeCats: PropTypes.object.isRequired,

  _addCategory: PropTypes.func.isRequired,
  _remCategory: PropTypes.func.isRequired,

  height: PropTypes.number.isRequired,
  display: PropTypes.bool.isRequired,
};

export default FluxComponent(Filter);
