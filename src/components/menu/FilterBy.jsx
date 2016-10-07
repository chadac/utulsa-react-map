import React, {Component, PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import AppState from '../../constants/AppState';
import classnames from 'classnames';
import styles from '../../stylesheets/FilterBy.scss';

const CategoryBox = React.createClass({
  render() {
    let style = {};
    style[styles.selected] = this.props.selected;
    return (
      <div className={classnames(styles.checkbox, style)}
           onClick={this._onCheck}>
        <div className={styles.content}>
          <input type="checkbox" onChange={this._onCheck}
                 checked={this.props.selected}
          />
          <span>{this.props.category}</span>
        </div>
      </div>
    );
  },

  _onCheck() {
    if(!this.props.selected) {
      this.props._addCategory(this.props.category);
    } else {
      this.props._remCategory(this.props.category);
    }
  },
});

const FilterBy = React.createClass({

  render() {
    const checkboxes = this.props.categories.map((category) => (
      <CategoryBox key={category} category={category}
                   selected={this.props.activeCategories.indexOf(category)>=0}
                   _addCategory={this.props._addCategory}
                   _remCategory={this.props._remCategory} />
    ));
    return (
      <div className={styles.FilterBy}>
        {checkboxes}
      </div>
    );
  },
});

module.exports = FilterBy;
