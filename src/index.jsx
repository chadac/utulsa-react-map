import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import styles from './stylesheets/index.scss';
import ItemStore from './stores/ItemStore';

console.log("Loading items...");
ItemStore.load();

ReactDOM.render(
  <App />,
  document.querySelector('#app')
);
