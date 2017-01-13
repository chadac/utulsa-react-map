import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';

import AppConstants from '../constants/AppConstants';
import AppState from '../constants/AppState';

import ItemConstants from '../constants/ItemConstants';
import ItemStore from './ItemStore';


const CHANGE_EVENT = "change";

var _currentState = AppState.NORMAL;

function setState(state) {
  _currentState = state;
}

class AppStoreProto extends EventEmitter {
  constructor() {
    super();

    this.dispatcherIndex = AppDispatcher.register(this.dispatch.bind(this));
  }

  getState() {
    return _currentState;
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  dispatch(action) {
    switch(action.actionType) {
      case AppConstants.APP_SET_STATE:
        setState(action.state);
        this.emitChange();
        break;

      case ItemConstants.ITEM_SELECT:
        setState(AppState.SELECT);
        this.emitChange();
        break;

      case ItemConstants.ITEM_DESELECT:
        setState(AppState.NORMAL);
        this.emitChange();
        break;

      case ItemConstants.ITEM_CLOSE_INFOWINDOW:
        if(_currentState === AppState.SELECT) {
          setState(AppState.NORMAL);
          this.emitChange();
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
        this.emitChange();
        break;

      case ItemConstants.ITEM_RESET_SEARCH:
        AppDispatcher.waitFor([
          ItemStore.dispatcherIndex,
        ]);
        if(_currentState === AppState.SEARCH)
          setState(AppState.NORMAL);
        this.emitChange();
        break;
    }
    return true;
  }
}

var AppStore = new AppStoreProto();

export default AppStore;
