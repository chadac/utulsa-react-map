import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import AppDispatcher from './dispatcher/AppDispatcher';
import ItemStore from './stores/ItemStore';
import GMapsStore from './stores/GMapsStore';
import AppStore from './stores/AppStore';

import ItemActions from './actions/ItemActions';
import GMapsActions from './actions/GMapsActions';
import AppActions from './actions/AppActions';

import './stylesheets/index.scss';

console.log("Loading items...");
ItemStore.load();

ReactDOM.render(
  <App
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
