const AppDispatcher = require('../dispatcher/AppDispatcher');
const EventEmitter = require('events').EventEmitter;
const assign = require('object-assign');

const AppConstants = require('../constants/AppConstants');
const AppState = require('../constants/AppState');

const ItemConstants = require('../constants/ItemConstants');
const ItemStore = require('./ItemStore');


const CHANGE_EVENT = "change";

var _currentState = AppState.NORMAL;

function setState(state) {
  _currentState = state;
}

var AppStore = assign({}, EventEmitter.prototype, {
  getState() {
    return _currentState;
  },

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register((action) => {
    switch(action.actionType) {

      case AppConstants.APP_SET_STATE:
        setState(action.state);
        AppStore.emitChange();
        break;

      case ItemConstants.ITEM_SELECT:
        setState(AppState.SELECT);
        AppStore.emitChange();
        break;

      case ItemConstants.ITEM_DESELECT:
        setState(AppState.NORMAL);
        AppStore.emitChange();
        break;

      case ItemConstants.ITEM_CLOSE_INFOWINDOW:
        if(_currentState === AppState.SELECT) {
          setState(AppState.NORMAL);
          AppStore.emitChange();
        }
        break;

      case ItemConstants.ITEM_SEARCH:
        AppDispatcher.waitFor([
          ItemStore.dispatcherIndex,
        ]);
        if(action.word.length <= 0)
          setState(AppState.NORMAL);
        else
          setState(AppState.SEARCH);
        AppStore.emitChange();
        break;

      case ItemConstants.ITEM_RESET_SEARCH:
        AppDispatcher.waitFor([
          ItemStore.dispatcherIndex,
        ]);
        if(_currentState === AppState.SEARCH)
          setState(AppState.NORMAL);
        AppStore.emitChange();
        break;
    }
    return true;
  }),
});

export default AppStore;
