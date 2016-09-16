import React, {Component} from 'react';
import BurgerMenu from 'react-burger-menu';

const BurgerStyles = {
  bmBurgerButton: {
    position: 'fixed',
    width: '36px',
    height: '30px',
    left: '36px',
    top: '36px'
  },
  bmBurgerBars: {
    background: '#373a47'
  },
  bmCrossButton: {
    height: '24px',
    width: '24px'
  },
  bmCross: {
    background: '#bdc3c7'
  },
  bmMenu: {
    background: '#373a47',
    padding: '2.5em 1.5em 0',
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

const Listing = React.createClass({
  render() {
    const Menu = BurgerMenu['slide'];
    return (
      <Menu pageWrapId={this.props.pageWrapId}
            outerContainerId={this.props.outerContainerId}
            styles={BurgerStyles}
            wait={20}
            left noOverlay>
        <form><input type="text" /></form>
      </Menu>
    );
  },
});

export default Listing;
