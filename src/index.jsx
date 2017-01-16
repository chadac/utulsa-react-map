import React from 'react';
import ReactDOM from 'react-dom';
import Map from './components/Map';

import AppDispatcher from './dispatcher/AppDispatcher';
import ItemStore from './stores/ItemStore';
import GMapsStore from './stores/GMapsStore';
import AppStore from './stores/AppStore';

import ItemActions from './actions/ItemActions';
import GMapsActions from './actions/GMapsActions';
import AppActions from './actions/AppActions';

import './stylesheets/globals.scss';
import './stylesheets/index.scss';

// Call method to load all items we have from JSON.
ItemStore.load();

// Pass in Flux stores, actions, and the app dispatcher
ReactDOM.render(
  <Map
      dispatcher={AppDispatcher}
      stores={{
        item: ItemStore,
        gmaps: GMapsStore,
        app: AppStore,
      }}
      actions={{
        item: ItemActions,
        gmaps: GMapsActions,
        app: AppActions,
      }}
  />,
  document.querySelector('#app')
);
