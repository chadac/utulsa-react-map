import React, {Component} from 'react';
import ItemStore from '../stores/ItemStore';
import classnames from 'classnames';
import BurgerMenu from 'react-burger-menu';
import styles from '../stylesheets/Listing.scss';

// TODO: Figure out how to import styles in this format using webpack's
//       css-loader.
const BurgerStyles = {
  bmBurgerButton: {
    position: 'fixed',
    width: '36px',
    height: '30px',
    left: 'initial',
    right: '36px',
    top: '36px'
  },
  bmBurgerBars: {
    background: 'rgb(0, 70, 100)'
  },
  bmCrossButton: {
    height: '24px',
    width: '24px',
    marginRight: '10px',
  },
  bmCross: {
    background: 'rgb(255, 255, 255)',
  },
  bmMenu: {
    background: 'rgb(0, 75, 141)',
    padding: '2.5em 0.5em 0',
    fontSize: '1.15em'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmItemList: {
    color: '#b8b7ad',
    padding: '0.8em'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)'
  }
}

const MenuWrapper = React.createClass({
  render() {
    return (
      <div className={classnames(styles.menuWrapper)}>
        {this.props.children}
      </div>
    );
  },
});

const SearchBar = React.createClass({
  render() {
    return (
      <input className={classnames(styles.searchBar)} type="text" />
    );
  }
});

const SearchItem = React.createClass({
  render() {
    return (
      <a href="#" className={classnames(styles.searchItem)}>
        <span>{this.props.name}</span>
      </a>
    );
  }
});

const Listing = React.createClass({
  render() {
    const Menu = BurgerMenu['slide'];
    const searchItems = ItemStore.getAll().map((item) => (
      <SearchItem {...item} />
    ));
    return (
      <MenuWrapper>
        <Menu pageWrapId={this.props.pageWrapId}
              outerContainerId={this.props.outerContainerId}
              styles={BurgerStyles}
              wait={20}
              right noOverlay>
          <SearchBar />
          {searchItems}
        </Menu>
      </MenuWrapper>
    );
  },
});

export default Listing;
