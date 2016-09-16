import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Map from './Map'
import styles from '../stylesheets/App.scss'

const App = React.createClass({
  getDefaultProps() {
    return {
      center: {lat: 36.15159935580428, lng: -95.94644401639404},
      zoom: 16
    };
  },

  render() {
    return (
      <div className={styles.App}>
        <Map
        />
      </div>
    );
  }
});

export default App;
