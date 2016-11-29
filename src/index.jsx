import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import AppDispatcher from './dispatcher/AppDispatcher';
import ItemStore from './stores/ItemStore';
import GMapsStore from './stores/GMapsStore';
import AppStateStore from './stores/AppStateStore';
import ItemActions from './actions/ItemActions';
import GMapsActions from './actions/GMapsActions';
import AppStateActions from './actions/AppStateActions';

import './stylesheets/index.scss';

console.log("Loading items...");
ItemStore.load();

ReactDOM.render(
  <App
      dispatcher={AppDispatcher}
      stores={{
        item: ItemStore,
        gmaps: GMapsStore,
        appState: AppStateStore,
      }}
      actions={{
        item: ItemActions,
        gmaps: GMapsActions,
        appState: AppStateActions,
      }}
  />,
  document.querySelector('#app')
);
