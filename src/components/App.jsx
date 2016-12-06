import React, {Component, PropTypes} from 'react';

import FluxComponent from '../hoc/FluxComponent';
//import SearchBar from './menu/SearchBar';
//import AnimatedMenu from './menu/AnimatedMenu';
//import SearchResults from './menu/SearchResults';
//import ModalWindow from './modal/ModalWindow';
//import ItemInfoBlock from './modal/ItemInfoBlock';
//import IndexBlock from './modal/IndexBlock';

import Map from './map/Map';

//import AppState from '../constants/AppState';

import classnames from 'classnames/bind';
import styles from '../stylesheets/App.scss';
const cx = classnames.bind(styles);


class App extends Component {
  getItemState() {
    return { items: this.stores().item.getAll() };
  }

  getAppState() {
    return {
      appState: this.stores().app.getState(),
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      items: this.stores().item.getAll(),
      appState: this.stores().app.getState(),
      initialCenter: this.props.initialCenter || this.stores().gmaps.getCenter(),
      initialZoom: this.props.initialZoom || this.stores().gmaps.getZoom(),
    };
  }

  componentWillMount() {
    this.stores().item.addChangeListener(this._onItemChange.bind(this));
    this.stores().app.addChangeListener(this._onAppChange.bind(this));
  }

  render() {
    return (
      <div className={cx("outer-container")}>
        <Map center={this.state.initialCenter} zoom={this.state.initialZoom}
             items={this.state.items} appState={this.state.appState}
             {...this.flux()} />
      </div>
    );
  }

  _onItemChange() {
    this.setState(this.getItemState());
  }

  _onAppChange() {
    this.setState(this.getAppState());
  }
}

App.propTypes = {
  initialCenter: PropTypes.object,
  initialZoom: PropTypes.object,
};

export default FluxComponent(App);
