import React, {Component, PropTypes} from 'react';
// import shouldPureComponentUpdate from 'react-pure-render/function';

import FluxComponent from '../hoc/FluxComponent';
import SearchBar from './menu/SearchBar';
import AnimatedMenu from './menu/AnimatedMenu';
import SearchResults from './menu/SearchResults';
import ModalWindow from './modal/ModalWindow';
import ItemInfoBlock from './modal/ItemInfoBlock';
import IndexBlock from './modal/IndexBlock';
import Map from './map/Map';

import AppState from '../constants/AppState';

import classnames from 'classnames/bind';
import styles from '../stylesheets/App.scss';
const cx = classnames.bind(styles);


class App extends Component {
  getItemState() {
    return { items: this.stores().item.getAll() };
  }

  getAppState() {
    return {
      appState: this.stores().appState.getState(),
      inFocusModal: this.stores().appState.isInFocus(),
      inIndexModal: this.stores().appState.isInIndex(),
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      items: this.stores().item.getAll(),
      appState: this.stores().appState.getState(),
      inFocusModal: this.stores().appState.isInFocus(),
      inIndexModal: this.stores().appState.isInIndex(),
      initialCenter: this.props.initialCenter || this.stores().gmaps.getCenter(),
      initialZoom: this.props.initialZoom || this.stores().gmaps.getZoom(),
    };
  }

  componentWillMount() {
    this.stores().item.addChangeListener(this._onItemChange.bind(this));
    this.stores().appState.addChangeListener(this._onAppStateChange.bind(this));
  }

  _getModalWindow() {
    if(this.state.inFocusModal) {
      var focusedItem = this.stores().item.getFocused();
      return (
        <ItemInfoBlock key="item_window" {...focusedItem} />
      );
    }
    else if(this.state.inIndexModal) {
      return (
        <IndexBlock key="index" items={this.stores().item.getItemsByCategory()}
                    _select={this.actions().item.select} />
      );
    }
    return null;
  }

  render() {
    const items = this
      .state.items
      .filter((item) => {
        switch(this.state.appState) {
          case AppState.SEARCH:
            return item.$searchKey === this.stores().item.getSearchKey();
          default:
            return true;
        }
      });

    const filteredItems = items
      .filter((item) =>
        this.stores().item.getActiveCategories().indexOf(item.category) >= 0);

    let modalWindow = this._getModalWindow();

    return (
      <div className={cx("outer-container")}>
        <ModalWindow {...this.flux()}>
          {modalWindow}
        </ModalWindow>
        <SearchBar
            appState={this.state.appState}
            inIndexModal={this.state.inIndexModal}
            {...this.flux()} />
        <AnimatedMenu>
          { this.state.appState === AppState.SEARCH ?
            ( <SearchResults items={items} select={this.actions().item.select}
                             categories={this.stores().item.getCategories()}
                             activeCategories={this.stores().item.getActiveCategories()}
                             {...this.flux()} /> )
            : null }
        </AnimatedMenu>
        <Map initialCenter={this.state.initialCenter} initialZoom={this.state.initialZoom}
             appState={this.state.appState} items={filteredItems}
             categories={this.stores().item.getCategories()}
             activeCategories={this.stores().item.getActiveCategories()}
             {...this.flux()} />
      </div>
    );
  }

  _onItemChange() {
    this.setState(this.getItemState());
  }

  _onAppStateChange() {
    this.setState(this.getAppState());
  }
}

App.propTypes = {
  initialCenter: PropTypes.object,
  initialZoom: PropTypes.object,
};

export default FluxComponent(App);
