import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import styles from './stylesheets/index.scss';
import ItemStore from './stores/ItemStore';

ReactDOM.render(
  <App />,
  document.querySelector('#app')
);

setTimeout(function() {
  console.log("Loading items...");
  ItemStore.load();
}, 1000);
