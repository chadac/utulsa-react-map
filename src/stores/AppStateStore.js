const AppDispatcher = require('../dispatcher/AppDispatcher');
const EventEmitter = require('events').EventEmitter;
const AppStateConstants = require('../constants/AppStateConstants');
const AppState = require('../constants/AppState');
const ItemConstants = require('../constants/ItemConstants');
const ItemStore = require('./ItemStore');
const assign = require('object-assign');

const CHANGE_EVENT = "change";

var _currentState = AppState.NORMAL;

var _filterByMenu = false;

function setState(state) {
  _currentState = state;
}

function reset() {
  _currentState = AppState.NORMAL;
}

function openFilterByMenu() {
  _filterByMenu = true;
}

function closeFilterByMenu() {
  _filterByMenu = false;
}

var AppStateStore = assign({}, EventEmitter.prototype, {
  getState() {
    return _currentState;
  },

  isFilterByMenuOpen() {
    return _filterByMenu;
  },

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register((payload) => {
    var action = payload.action;

    switch(action.actionType) {

      case AppStateConstants.APP_STATE_SET:
        setState(action.state);
        AppStateStore.emitChange();
        break;

      case AppStateConstants.APP_STATE_RESET:
        reset();
        AppStateStore.emitChange();
        break;

      case AppStateConstants.FILTER_BY_OPEN:
        reset();
        openFilterByMenu();
        AppStateStore.emitChange();
        break;

      case AppStateConstants.FILTER_BY_CLOSE:
        closeFilterByMenu();
        AppStateStore.emitChange();
        break;

      case ItemConstants.ITEM_SELECT:
        setState(AppState.SELECT);
        AppStateStore.emitChange();
        break;

      case ItemConstants.ITEM_DESELECT:
        setState(AppState.NORMAL);
        AppStateStore.emitChange();
        break;

      case ItemConstants.ITEM_CLOSE_INFOWINDOW:
        if(_currentState == AppState.SELECT) {
          setState(AppState.NORMAL);
          AppStateStore.emitChange();
        }
        break;

      case ItemConstants.ITEM_SEARCH:
        AppDispatcher.waitFor([
          ItemStore.dispatcherIndex,
        ]);
        closeFilterByMenu();
        setState(AppState.SEARCH);
        AppStateStore.emitChange();
        break;

      case ItemConstants.ITEM_RESET_SEARCH:
        AppDispatcher.waitFor([
          ItemStore.dispatcherIndex,
        ]);
        reset();
        closeFilterByMenu();
        AppStateStore.emitChange();
        break;
    }

    return true;
  }),
});

module.exports = AppStateStore;
