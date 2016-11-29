const AppDispatcher = require('../dispatcher/AppDispatcher');
const EventEmitter = require('events').EventEmitter;
const AppStateConstants = require('../constants/AppStateConstants');
const AppState = require('../constants/AppState');
const ItemConstants = require('../constants/ItemConstants');
const ItemStore = require('./ItemStore');
const assign = require('object-assign');

const CHANGE_EVENT = "change";

var _currentState = AppState.NORMAL;

const MODAL_FOCUS = "focus";
const MODAL_INDEX = "index";
var _modalWindow = null;

function setState(state) {
  _currentState = state;
}

function reset() {
  _currentState = AppState.NORMAL;
}

function openFocusModal() {
  _modalWindow = MODAL_FOCUS;
}

function openIndexModal() {
  _modalWindow = MODAL_INDEX;
}

function closeModal() {
  _modalWindow = null;
}

var AppStateStore = assign({}, EventEmitter.prototype, {
  getState() {
    return _currentState;
  },

  isInFocus() {
    return _modalWindow === MODAL_FOCUS;
  },

  isInIndex() {
    return _modalWindow === MODAL_INDEX;
  },

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register((action) => {
    switch(action.actionType) {

      case AppStateConstants.APP_STATE_SET:
        setState(action.state);
        AppStateStore.emitChange();
        break;

      case AppStateConstants.APP_STATE_RESET:
        reset();
        AppStateStore.emitChange();
        break;

      case AppStateConstants.OPEN_INDEX_MODAL:
        openIndexModal();
        AppStateStore.emitChange();
        break;

      case AppStateConstants.CLOSE_MODAL:
        AppDispatcher.waitFor([
          ItemStore.dispatcherIndex,
        ]);
        closeModal();
        AppStateStore.emitChange();
        break;

      case ItemConstants.ITEM_SELECT:
        setState(AppState.SELECT);
        closeModal();
        AppStateStore.emitChange();
        break;

      case ItemConstants.ITEM_DESELECT:
        setState(AppState.NORMAL);
        AppStateStore.emitChange();
        break;

      case ItemConstants.ITEM_FOCUS:
        AppDispatcher.waitFor([
          ItemStore.dispatcherIndex,
        ]);
        openFocusModal();
        AppStateStore.emitChange();
        break;

      case ItemConstants.ITEM_UNFOCUS:
        AppDispatcher.waitFor([
          ItemStore.dispatcherIndex,
        ]);
        closeModal();
        AppStateStore.emitChange();
        break;

      case ItemConstants.ITEM_CLOSE_INFOWINDOW:
        if(_currentState === AppState.SELECT) {
          setState(AppState.NORMAL);
          AppStateStore.emitChange();
        }
        break;

      case ItemConstants.ITEM_SEARCH:
        AppDispatcher.waitFor([
          ItemStore.dispatcherIndex,
        ]);
        setState(AppState.SEARCH);
        AppStateStore.emitChange();
        break;

      case ItemConstants.ITEM_RESET_SEARCH:
        AppDispatcher.waitFor([
          ItemStore.dispatcherIndex,
        ]);
        reset();
        AppStateStore.emitChange();
        break;
    }
    return true;
  }),
});

module.exports = AppStateStore;
