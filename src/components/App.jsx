import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Map from './Map';
import Listing from './Listing';
import styles from '../stylesheets/App.scss';
import ItemStore from '../stores/ItemStore';
import GMapsStore from '../stores/GMapsStore';
import GMapsActions from '../actions/GMapsActions';

function getItemState() {
  return {
    markers: ItemStore.getMarkers(),
    routes: ItemStore.getRoutes()
  };
}

const App = React.createClass({
  getInitialState() {
    return getItemState();
  },

  getDefaultProps() {
    return {
      initialCenter: GMapsStore.getCenter(),
      initialZoom: GMapsStore.getZoom(),
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
               _onZoom={GMapsActions.zoom} _onCenter={GMapsActions.center}
               markers={this.state.markers} routes={this.state.routes}
          />
        </main>
      </div>
    );
  },

  _onChange() {
    this.setState(getItemState());
  },
});

export default App;
