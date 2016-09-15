import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import styles from './stylesheets/index.scss';

function parseKMLCoords(msg) {
  var msgSplit = msg.split(' ');
  msgSplit.map((coordStr) => {
    var coords = coordStr.split(',')
    return { lng: coords[0], lat: coords[1] };
  });
}

ReactDOM.render(
  <App />,
  document.querySelector('#app')
);
