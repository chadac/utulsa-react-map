/**
 * Store for app information -- mostly the application state.
 * This is used inside the application to track what the user is
 * currently doing, such as searching, adjusting the filter, or
 * looking at a particular item.
 *
 * @module AppStore
 */
import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';

import AppConstants from '../constants/AppConstants';
import AppState from '../constants/AppState';

import ItemConstants from '../constants/ItemConstants';
import ItemStore from './ItemStore';


const CHANGE_EVENT = "change";


/****************************************************************
 * INTERNAL VARIABLES
 ****************************************************************/

// The current app state.
var _currentState = AppState.FILTER;


/****************************************************************
 * PRIVATE FUNCTIONS
 ****************************************************************/

/**
 * Changes the app state.
 * @param {AppState} state - The new app state.
 */
function setState(state) {
  _currentState = state;
}


/****************************************************************
 * STORE
 ****************************************************************/

/**
 * The app state store.
 * @class
 */
class AppStoreProto extends EventEmitter {
  constructor() {
    super();

    this.dispatcherIndex = AppDispatcher.register(this.dispatch.bind(this));
  }

  /****************************************************************
   * GETTERS
   ****************************************************************/

  /**
   * @returns {AppState} appState - The current app state.
   */
  getState() {
    return _currentState;
  }

  /****************************************************************
   * EMITTERS
   ****************************************************************/

  /**
   * Emits changes for the app state.
   */
  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  /****************************************************************
   * LISTENERS
   ****************************************************************/

  /**
   * Listener on changes to app state.
   * @param {requestCallback} callback - The callback function.
   */
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  /****************************************************************
   * DISPATCHER
   ****************************************************************/

  /**
   * Receives actions from the dispatcher and effects changes.
   * @param {Object} action - The action object.
   * @returns {boolean} success
   */
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
        if(_currentState === AppState.SEARCH) {
          setState(AppState.NORMAL);
          this.emitChange();
        }
        break;
    }
    return true;
  }
}

var AppStore = new AppStoreProto();


export default AppStore;
