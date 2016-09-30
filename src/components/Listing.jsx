import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';
import styles from '../stylesheets/Listing.scss';

const MenuWrapper = React.createClass({
  render() {
    return (
      <div className={classnames(styles.menuWrapper)}>
        {this.props.children}
      </div>
    );
  },
});

const ListingItem = React.createClass({
  componentWillMount() {
  },

  render() {
    const itemStyles = {};
    itemStyles[styles.selected] = this.props.$selected;

    return (
      <a href="#" className={classnames(styles.searchItem, itemStyles)}
         onClick={this._onClick}>
        <span>{this.props.name}</span>
      </a>
    );
  },

  _onClick() {
    ItemActions.select(this.props.id);
  },
});

const Listing = React.createClass({
  render() {
    const Menu = BurgerMenu['slide'];
    const searchItems = this.props.items.map((item) => (
      <ListingItem key={item.id} {...item} />
    ));
    return (
      <MenuWrapper>
        <Menu pageWrapId={this.props.pageWrapId}
              outerContainerId={this.props.outerContainerId}
              styles={BurgerStyles}
              wait={20}
              right noOverlay>
          <SearchBar _onSearch={this.props._onSearch} />
          {searchItems}
        </Menu>
      </MenuWrapper>
    );
  },
});

export default Listing;
