import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import SearchBar from './menu/SearchBar';
import AnimatedMenu from './menu/AnimatedMenu';
import SearchResults from './menu/SearchResults';
import FilterBy from './menu/FilterBy';
import ModalWindow from './modal/ModalWindow';
import ItemInfoBlock from './modal/ItemInfoBlock';
import Map from './map/Map';

import AppStateStore from '../stores/AppStateStore';
import ItemStore from '../stores/ItemStore';
import GMapsStore from '../stores/GMapsStore';

import ItemActions from '../actions/ItemActions';
import GMapsActions from '../actions/GMapsActions';
import AppStateActions from '../actions/AppStateActions';

import AppState from '../constants/AppState';

import styles from '../stylesheets/App.scss';

const extend = require('util')._extend;

function getItemState() {
  return { items: ItemStore.getAll() };
}

function getAppState() {
  return {
    appState: AppStateStore.getState(),
    filterBy: AppStateStore.isFilterByMenuOpen(),
    inFocus: AppStateStore.isInFocus(),
  };
}

const App = React.createClass({
  getInitialState() {
    return extend(getItemState(), getAppState());
  },

  getDefaultProps() {
    return {
      initialCenter: GMapsStore.getCenter(),
      initialZoom: GMapsStore.getZoom(),
    };
  },

  componentWillMount() {
    ItemStore.addChangeListener(this._onItemChange);
    AppStateStore.addChangeListener(this._onAppStateChange);
  },

  _getModalWindow() {
    if(this.state.inFocus) {
      var focusedItem = ItemStore.getFocused();
      return (
        <ItemInfoBlock {...focusedItem} _unfocus={ItemActions.unfocus} />
      );
    }
    return null;
  },

  render() {
    const items = this.state.items.filter((item) => {
      switch(this.state.appState) {
        case AppState.NORMAL:
          return true;
        case AppState.SEARCH:
          return item.$searchKey == ItemStore.getSearchKey();
        case AppState.FILTER:
          return ItemStore.getActiveCategories().indexOf(item.category) >= 0;
      }
      return true;
    });

    let modalWindow = this._getModalWindow();

    return (
      <div id="outer-container" style={{height:"100%"}} className={styles.outerContainer}>
        <ModalWindow _unfocus={ItemActions.unfocus}>
          {modalWindow}
        </ModalWindow>
        <SearchBar
            _search={ItemActions.search}
            appState={this.state.appState}
            _resetCategories={ItemActions.resetCategories}
            _openFilterBy={AppStateActions.openFilterBy}
            _closeFilterBy={AppStateActions.closeFilterBy}
            appState={this.state.appState} />
        <AnimatedMenu>
          { this.state.appState == AppState.SEARCH ?
            ( <SearchResults items={items} select={ItemActions.select} /> )
            : null }
          { this.state.appState == AppState.FILTER ?
            ( <FilterBy categories={ItemStore.getCategories()}
                        activeCategories={ItemStore.getActiveCategories()}
                        _addCategory={ItemActions.addCategory}
                        _remCategory={ItemActions.remCategory}
                        _reset={ItemActions.resetCategories} /> )
            : null }
        </AnimatedMenu>
        <Map center={this.props.initialCenter} zoom={this.props.initialZoom}
             _onZoom={GMapsActions.zoom} _onCenter={GMapsActions.center}
             appState={this.state.appState} items={items}
             _openInfoWindow={ItemActions.openInfoWindow}
             _closeInfoWindow={ItemActions.closeInfoWindow}
             _focus={ItemActions.focus}
        />
      </div>
    );
  },

  _onItemChange() {
    this.setState(getItemState());
  },

  _onAppStateChange() {
    this.setState(getAppState());
  }
});

export default App;
