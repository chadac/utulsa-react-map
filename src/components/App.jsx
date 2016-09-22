import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Map from './Map';
import Listing from './Listing';
import styles from '../stylesheets/App.scss';
import ItemStore from '../stores/ItemStore';

ItemStore.load();

const App = React.createClass({
  getDefaultProps() {
    return {
      center: {lat: 36.15159935580428, lng: -95.94644401639404},
      zoom: 16
    };
  },

  render() {
    return (
      <div id="outer-container">
        <Listing pageWrapId={ "page-wrap" } outerContainerId={ "outer-container" } />
        <main id="page-wrap" className={styles.App}>
          <Map />
        </main>
      </div>
    );
  }
});

export default App;
