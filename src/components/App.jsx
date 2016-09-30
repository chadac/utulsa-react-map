import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import styles from '../stylesheets/App.scss';

import SearchBar from './menu/SearchBar';
import SearchResults from './menu/SearchResults';
import Map from './Map';

import AppStateStore from '../stores/AppStateStore';
import ItemStore from '../stores/ItemStore';
import GMapsStore from '../stores/GMapsStore';

import ItemActions from '../actions/ItemActions';
import GMapsActions from '../actions/GMapsActions';

import AppState from '../constants/AppState';

const extend = require('util')._extend;

function getItemState() {
  return { items: ItemStore.getAll() };
}

function getAppState() {
  return { appState: AppStateStore.getState() };
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

  render() {
    const items = this.state.items.filter((item) => {
      switch(this.state.appState) {
        case AppState.NORMAL:
          return true;
        case AppState.SEARCH:
          return item.$searchKey == ItemStore.getSearchKey();
      }
      return true;
    });

    return (
      <div id="outer-container" style={{height:"100%"}}>
        <SearchBar
            _search={ItemActions.search}
            appState={this.state.appState} items={items} />
        <Map center={this.props.initialCenter} zoom={this.props.initialZoom}
             _onZoom={GMapsActions.zoom} _onCenter={GMapsActions.center}
             appState={this.state.appState} items={items}
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
