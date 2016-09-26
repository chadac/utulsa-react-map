import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import styles from './stylesheets/index.scss';
import ItemStore from './stores/ItemStore';

ItemStore.load();

ReactDOM.render(
  <App />,
  document.querySelector('#app')
);
