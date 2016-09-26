import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Map from './Map';
import Listing from './Listing';
import styles from '../stylesheets/App.scss';
import ItemStore from '../stores/ItemStore';

function getMapState() {
  return {
    markers: ItemStore.getMarkers(),
    routes: ItemStore.getRoutes()
  };
}

const App = React.createClass({
  getInitialState() {
    return getMapState();
  },

  getDefaultProps() {
    return {
      initialCenter: {lat: 36.15159935580428, lng: -95.94644401639404},
      initialZoom: 16
    };
  },

  componentWillMount() {
    ItemStore.addChangeListener(this._onChange);
  },

  render() {
    return (
      <div id="outer-container">
        <Listing pageWrapId={ "page-wrap" } outerContainerId={ "outer-container" } />
        <main id="page-wrap" className={styles.App}>
          <Map center={this.props.initialCenter} zoom={this.props.initialZoom}
              markers={this.state.markers} routes={this.state.routes} />
        </main>
      </div>
    );
  },

  _onChange() {
    this.setState(getMapState());
  },
});

export default App;
