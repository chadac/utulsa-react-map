import React, {Component} from 'react';
import ItemStore from '../stores/ItemStore';
import ItemActions from '../actions/ItemActions';
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

function getListingState() {
  return {
    items: ItemStore.getAll(),
  };
}

const Listing = React.createClass({
  getInitialState() {
    return getListingState();
  },

  componentDidMount() {
    ItemStore.addChangeListener(this._onChange);
  },

  render() {
    const Menu = BurgerMenu['slide'];
    const searchItems = this.state.items.map((item) => (
      <SearchItem key={item.id} {...item} />
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

  _onChange() {
    this.setState(getListingState());
  },
});

export default Listing;
