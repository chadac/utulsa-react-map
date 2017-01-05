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

import 'material-design-icons/iconfont/MaterialIcons-Regular.ttf';
import 'material-design-icons/iconfont/MaterialIcons-Regular.woff';
import 'material-design-icons/iconfont/MaterialIcons-Regular.woff2';
import 'material-design-icons/iconfont/material-icons.css';
import './stylesheets/index.scss';

ItemStore.load();

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
